const prisma = require("../config/prisma");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const department = await prisma.department.create({
      data: {
        name: name,
      },
    });

    res.json({
      department,
      message: "Created department successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.listDepartment = async (req, res) => {
  try {
    const { role,department } = req.user;
    const departmentId = department?.id;
    const { query, page = 1, limit = 5 } = req.query;


    let whereCondition = {};

    if (query) {
      whereCondition = {
        OR: [{ name: { contains: query } }],
      };
    }

    const take = parseInt(limit); // จำนวนที่ต้องการดึง
    const skip = (parseInt(page) - 1) * take; // คำนวณ offset


    let departments;
    if (role === "ADMIN") {
      departments = await prisma.department.findMany({
        where: whereCondition,
        include: {
          _count: {
            select: { user: true },
          },
        },
        take, // ✅ ใช้ Prisma pagination
        skip,
      });
    } else if (role === "SUPERVISOR") {
      departments = await prisma.department.findMany({
        where: {
          ...whereCondition,
          id: departmentId, // กรองด้วย departmentId
        },
        include: {
          _count: {
            select: { user: true },
          },
        },
        take, // ✅ ใช้ Prisma pagination
        skip,
      });
    } else {
      return res.status(403).json({
        message: "Access Denied: Unauthorized role",
      });
    }

    const count = await prisma.department.count({where: whereCondition })
    res.json({
      totalDepartments: count,
      departments,
      totalPages: Math.ceil(count / take), // จำนวนหน้าทั้งหมด
      currentPage: parseInt(page),
    })
  } catch (error) {
    console.log(error);
  }
};

exports.readDepartment=async(req,res)=>{
  try {
    const { id } = req.params
    const department = await prisma.department.findFirst({
      where: {
        id: Number(id)
      }
    })
    res.json({
      department
    })
  } catch (error) {
    console.log(error)
  }
}

exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const checkDepartment = await prisma.department.findUnique({
      where: {
        id: Number(id)
      }
    })

    if(!checkDepartment){
      return res.status(404).json({
        message: "Department Not found"
      })
    }

    const department = await prisma.department.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
      },
    });

    res.json({
      department,
      message: "Upadated department successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const checkDepartment = await prisma.department.findUnique({
      where: {
        id: Number(id)
      }
    })

    if(!checkDepartment){
      return res.status(404).json({
        message: "Department Not found"
      })
    }

     // 🔎 ตรวจสอบว่ามี user ใช้ department นี้อยู่ไหม
     const departmentUsers = await prisma.user.findMany({
      where: { departmentId: Number(id) },
    });

    if (departmentUsers.length > 0) {
      return res.status(400).json({ message: "ไม่สามารถลบได้ มีผู้ใช้ในแผนกนี้อยู่!" });
    }

    const department = await prisma.department.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      department,
      message: "Deleted department successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
