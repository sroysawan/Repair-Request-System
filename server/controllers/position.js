const prisma = require("../config/prisma");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const position = await prisma.position.create({
      data: {
        name: name,
      },
    });
    res.json({
      position,
      message: "Created position successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.listPosition = async (req, res) => {
  try {
    const { role } = req.user;
    let position;
    if (role === "ADMIN") {
      position = await prisma.position.findMany();
    } else if (role === "SUPERVISOR") {
      position = await prisma.position.findMany({
        where: {
          name: {
            in: ["หัวหน้าช่าง", "ช่าง"], // กรองตามชื่อภาษาไทย
          },
        },
      });
    } else {
      return res.status(403).json({
        message: "Access Denied: Unauthorized role",
      });
    }

    const count = await prisma.position.count();
    res.json({
      totalPositions: count,
      position,
    });
  } catch (error) {
    console.log(first);
  }
};

exports.updatePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const checkPosition = await prisma.position.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!checkPosition) {
      return res.status(404).json({
        message: "Position Not found",
      });
    }

    const position = await prisma.position.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
      },
    });

    res.json({
      position,
      message: "Updated position successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deletePosition = async (req, res) => {
  try {
    const { id } = req.params;

    const checkPosition = await prisma.position.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!checkPosition) {
      return res.status(404).json({
        message: "Position Not found",
      });
    }

    const position = await prisma.position.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      position,
      message: "Delete position successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
