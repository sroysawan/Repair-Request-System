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
    const { role } = req.user;

    let department;
    if (role === "ADMIN") {
      department = await prisma.department.findMany({
        include: {
          _count: {
            select: { user: true },
          },
        },
      });
    } else if (role === "SUPERVISOR") {
      department = await prisma.department.findMany({
        where: {
          name: "IT Support",
        },
        include: {
          _count: {
            select: { user: true },
          },
        },
      });
    } else {
      return res.status(403).json({
        message: "Access Denied: Unauthorized role",
      });
    }

    const count = await prisma.department.count()
    res.json({
      totalDepartments: count,
      department
    })
  } catch (error) {
    console.log(error);
  }
};

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
