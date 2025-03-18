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
    const { query, page = 1, limit = 5 } = req.query;

    let whereCondition = {};

    if (query) {
      whereCondition = {
        OR: [{ name: { contains: query } }],
      };
    }

    const take = parseInt(limit); // จำนวนที่ต้องการดึง
    const skip = (parseInt(page) - 1) * take; // คำนวณ offset

    const position = await prisma.position.findMany({
      where: whereCondition,

      include: {
        _count: {
          select: { user: true },
        },
      },
      take, 
      skip,
    });

    const count = await prisma.position.count(
      {where: whereCondition }
    );
    res.json({
      totalPositions: count,
      position,
      totalPages: Math.ceil(count / take), // จำนวนหน้าทั้งหมด
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log(first);
  }
};

exports.readPosition = async (req, res) => {
  try {
    const { id } = req.params;
    const position = await prisma.position.findFirst({
      where: {
        id: Number(id),
      },
    });
    res.json({
      position,
    });
  } catch (error) {
    console.log(error);
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

    // 🔎 ตรวจสอบว่ามี user ใช้ position นี้อยู่ไหม
    const positionUsers = await prisma.user.findMany({
      where: { positionId: Number(id) }, // ✅ ตรวจสอบผู้ใช้ที่มีตำแหน่งนี้จริงๆ
    });

    if (positionUsers.length > 0) {
      return res
        .status(400)
        .json({ message: "ไม่สามารถลบได้ มีผู้ใช้ในตำแหน่งนี้อยู่!" });
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
