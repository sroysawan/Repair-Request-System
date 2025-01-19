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
      department = await prisma.department.findMany();
    } else if (role === "SUPERVISOR") {
      department = await prisma.department.findMany({
        where: {
          name: "IT Support",
        },
      });
    } else {
      return res.status(403).json({
        message: "Access Denied: Unauthorized role",
      });
    }
    res.send(department);
  } catch (error) {
    console.log(error);
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

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
