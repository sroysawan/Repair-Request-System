const prisma = require("../config/prisma");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await prisma.equipmentCategory.create({
      data: {
        name: name,
      },
    });
    res.json({
      category,
      message: "Create category successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.listCategory = async (req, res) => {
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

    const category = await prisma.equipmentCategory.findMany({
      where: whereCondition,

      include: {
        _count: {
          select: { equipment: true },
        },
      },
      orderBy: {
        createdAt: "desc"
      },
      take, // ✅ ใช้ Prisma pagination
      skip,
    });

    const count = await prisma.equipmentCategory.count({where: whereCondition });
    res.json({
      totalCategory: count,
      category,
      totalPages: Math.ceil(count / take), // จำนวนหน้าทั้งหมด
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log(error);
  }
};

exports.readCategory =async(req,res)=>{
  try {
    const { id } = req.params;
    const category = await prisma.equipmentCategory.findFirst({
      where: {
        id: Number(id),
      },
    });
    res.json({
      category,
    });
  } catch (error) {
    console.log(error);
  }
}

exports.updatedCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const checkCategory = await prisma.equipmentCategory.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!checkCategory) {
      return res.status(404).json({
        message: "Category Not found",
      });
    }

    const category = await prisma.equipmentCategory.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
      },
    });

    res.json({
      category,
      message: "Updated category successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const checkCategory = await prisma.equipmentCategory.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!checkCategory) {
      return res.status(404).json({
        message: "Category Not found",
      });
    }

    // 🔎 ตรวจสอบว่ามี user ใช้ department นี้อยู่ไหม
    const categoryEquipment = await prisma.equipment.findMany({
      where: { id: Number(id) },
    });

    if (categoryEquipment.length > 0) {
      return res
        .status(400)
        .json({ message: "ไม่สามารถลบได้ มีอุปกรณ์ในหมวดหมู่นี้อยู่!" });
    }

    const category = await prisma.equipmentCategory.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      category,
      message: "Deleted category successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
