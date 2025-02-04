const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
exports.listUser = async (req, res) => {
  try {
    const { role } = req.user; // role จะมาจาก token ที่ decode แล้วใน `authCheck`
    let users;
    if (role === "ADMIN") {
      // Admin: ดูรายชื่อผู้ใช้ทั้งหมด
      users = await prisma.user.findMany({
        select: {
          id: true,
          pictureId: true,
          firstName: true,
          lastName: true,
          userName: true,
          email: true,
          department: true,
          position: true,
          role: true,
          enabled: true,
          createdAt:true,
        },
        orderBy:{
          createdAt:"desc"
        }
      });
    } else if (role === "SUPERVISOR") {
      // Technician Lead: ดูเฉพาะผู้ใช้ที่เป็น "ช่าง"
      users = await prisma.user.findMany({
        where: {
          role: { in: ["TECHNICIAN", "SUPERVISOR"] }, // ดึง TECHNICIAN และ SUPERVISOR
        },
        select: {
          id: true,
          pictureId: true,
          firstName: true,
          lastName: true,
          department: true,
          position: true,
          role: true,
          enabled: true,
          createdAt:true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      return res.status(403).json({
        message: "Access Denied: Unauthorized role",
      });
    }

    const count = await prisma.user.count()
    res.json({
      totalUser: count,
      users
    })
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
        department: true,
        position: true,
      },
    });

    if(!user) {
      return res.status(404).json({
        message: "User not foun"
      })
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
    const { firstName, lastName, departmentId, positionId, tel, email, userName ,pictureId } =
      req.body;

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
        message = "Email and Username already exist.";
      } else if (checkEmailUsername.email === email) {
        message = "Email already exists.";
      } else if (checkEmailUsername.userName === userName) {
        message = "Username already exists.";
      }
      return res.status(400).json({
        message: message,
      });
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
        tel:tel,
        email: email,
        userName: userName,
        pictureId: pictureId
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
    const { role } = req.body;

    await prisma.user.update({
      where: {
        id:  req.checkUser.id,
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
