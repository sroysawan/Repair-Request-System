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
    const category = await prisma.equipmentCategory.findMany({
      include: {
        _count: {
          select: { equipment: true },
        },
      },
    });

    const count = await prisma.equipmentCategory.count()
    res.json({
      totalCategory: count,
      category,
    });
  } catch (error) {
    console.log(error);
  }
};

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
