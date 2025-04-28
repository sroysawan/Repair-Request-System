const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
exports.listUser = async (req, res) => {
  try {
    const { role } = req.user; // role จะมาจาก token ที่ decode แล้วใน `authCheck`
    const { query, page = 1, limit = 5, sortBy = "createdAt", sortOrder = "desc" } = req.query;

    // ✅ กำหนดเฉพาะ field ที่ให้ sort ได้ เพื่อความปลอดภัย
    const validSortFields = ["firstName", "lastName", "userName", "email", "createdAt"];
    const orderByCondition = validSortFields.includes(sortBy) ? { [sortBy]: sortOrder } : { createdAt: "desc" };
    
    let whereCondition = {};

    if (query) {
      whereCondition = {
        OR: [
          { firstName: { contains: query } },
          { lastName: { contains: query } },
          { userName: { contains: query } },
          { email: { contains: query } },
        ],
      };
    }

    const take = parseInt(limit); // จำนวนที่ต้องการดึง
    const skip = (parseInt(page) - 1) * take; // คำนวณ offset

    let users;
    let countForAdmin = 0;
    let countForSupervisor = 0;


    if (role === "ADMIN") {
      // Admin: ดูรายชื่อผู้ใช้ทั้งหมด
      users = await prisma.user.findMany({
        where: whereCondition,
        select: {
          id: true,
          picture: {
            select: {
              url: true, // ดึง URL ของรูปภาพ
            },
          },
          firstName: true,
          lastName: true,
          userName: true,
          email: true,
          department: {
            select: { name: true }, // ดึงเฉพาะชื่อ department
          },
          position: {
            select: { name: true }, // ดึงเฉพาะชื่อ position
          },
          role: true,
          enabled: true,
          createdAt: true,
        },
        orderBy: orderByCondition,
        take, // ✅ ใช้ Prisma pagination
        skip,
      });
      // ✅ นับจำนวนทั้งหมดที่ ADMIN สามารถเห็นได้
      countForAdmin = await prisma.user.count({ where: whereCondition });
    } else if (role === "SUPERVISOR") {
      // Technician Lead: ดูเฉพาะผู้ใช้ที่เป็น "ช่าง"
      users = await prisma.user.findMany({
        where: {
          ...whereCondition,
          role: { in: ["TECHNICIAN", "SUPERVISOR"] }, // ดึง TECHNICIAN และ SUPERVISOR
        },
        select: {
          id: true,
          picture: {
            select: {
              url: true, // ดึง URL ของรูปภาพ
            },
          },
          firstName: true,
          lastName: true,
          userName: true,
          email: true,
          department: { select: { name: true } },
          position: { select: { name: true } },
          role: true,
          enabled: true,
          createdAt: true,
        },
        orderBy: orderByCondition,
        take, // ✅ ใช้ Prisma pagination
        skip,
      });

      // ✅ นับจำนวนเฉพาะที่ SUPERVISOR สามารถเห็นได้
      countForSupervisor = await prisma.user.count({
        where: {
          ...whereCondition,
          role: { in: ["TECHNICIAN", "SUPERVISOR"] },
        },
      });
      console.log("countForSupervisor", countForSupervisor);
  
    } else {
      return res.status(403).json({
        message: "Access Denied: Unauthorized role",
      });
    }

    const countAdminDb = await prisma.user.count({
      where: { role: "ADMIN" },
    });
    const countSupervisorDb = await prisma.user.count({
      where: { role: "SUPERVISOR" },
    });
    const countTechnicianDb = await prisma.user.count({
      where: { role: "TECHNICIAN" },
    });
    const countUserDb = await prisma.user.count({
      where: { role: "USER" },
    });
    

    // ✅ นับจำนวนผู้ใช้ทั้งหมด
    // const totalUser = await prisma.user.count({ where: whereCondition });
    res.json({
      totalUser: role === "ADMIN" ? countForAdmin : countForSupervisor, // นับตามสิทธิ์ที่เห็น
      users,
      totalPages: Math.ceil(
        (role === "ADMIN" ? countForAdmin : countForSupervisor) / take
      ),
      currentPage: parseInt(page),
      countAdminDb,
      countSupervisorDb,
      countTechnicianDb,
      countUserDb
    });
  } catch (error) {
    console.log(error);
  }
};

exports.readUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findFirst({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        pictureId: true,
        firstName: true,
        lastName: true,
        userName: true,
        email: true,
        role: true,
        tel: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        position: {
          select: {
            id: true,
            name: true,
          },
        },
        picture: {
          select: {
            url: true, // ดึง URL ของรูปภาพ
            public_id: true,
          },
        },
        enabled: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not foun",
      });
    }
    res.send(user);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      departmentId,
      positionId,
      tel,
      email,
      userName,
      pictureId,
    } = req.body;

    const checkEmailUsername = await prisma.user.findFirst({
      where: {
        AND: [
          {
            OR: [{ email: email }, { userName: userName }],
          },
          {
            NOT: {
              id: req.checkUser.id, // กรอง id ของผู้ใช้ที่กำลังอัพเดท
            },
          },
        ],
      },
    });

    if (checkEmailUsername) {
      let message = "";

      if (
        checkEmailUsername.email === email &&
        checkEmailUsername.userName === userName
      ) {
        message = "Email และ Username นี้มีผู้ใช้แล้ว.";
      } else if (checkEmailUsername.email === email) {
        message = "Email นี้มีผู้ใช้แล้ว.";
      } else if (checkEmailUsername.userName === userName) {
        message = "Username นี้มีผู้ใช้แล้ว.";
      }
      return res.status(400).json({
        message: message,
      });
    }

    let imageId = req.checkUser.pictureId; // ค่าดั้งเดิม
    if (pictureId) {
      const image = await prisma.image.create({
        data: {
          asset_id: pictureId.asset_id,
          public_id: pictureId.public_id,
          url: pictureId.url,
          secure_url: pictureId.secure_url,
        },
      });
      imageId = image.id; // ใช้ imageId ใหม่
    }

    const user = await prisma.user.update({
      where: {
        id: req.checkUser.id,
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        departmentId: departmentId,
        positionId: positionId,
        tel: tel,
        email: email,
        userName: userName,
        pictureId: imageId,
      },
    });

    res.json({
      user,
      message: "Updated user successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.changeStatusUser = async (req, res) => {
  try {
    const { id, enabled } = req.body;
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        enabled: enabled,
      },
    });
    res.send("Update Status Success");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.changeRole = async (req, res) => {
  try {
    const { id, role } = req.body;

    await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        role: role,
      },
    });
    res.send("Update Role Success");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: req.checkUser.id },
      data: { password: hashPassword },
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
  }
};

exports.listSupervisorandTechnician = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ["TECHNICIAN"], // ดึง role ที่อยู่ใน array
        },
      },
    });

    res.json(users); // ส่งข้อมูลกลับไปที่ client
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
