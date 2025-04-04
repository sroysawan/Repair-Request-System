const prisma = require("../config/prisma");

exports.create = async (req, res) => {
  try {
    const {
      name,
      equipmentNumber,
      address,
      equipmentCategoryId,
      statusEquipment,
      images,
    } = req.body;

    const equipment = await prisma.equipment.create({
      data: {
        name: name,
        equipmentNumber: equipmentNumber,
        address: address,
        equipmentCategoryId: equipmentCategoryId,
        statusEquipment: statusEquipment,
        //1 อุปกรณ์มีได้หลายรูป loop เข้าไป
        images: images?.length
          ? {
              create: images.map((item) => ({
                asset_id: item.asset_id,
                public_id: item.public_id,
                url: item.url,
                secure_url: item.secure_url,
              })),
            }
          : undefined, // ถ้าไม่มีรูปภาพ ไม่ต้องสร้าง relation
      },
    });
    res.json({
      equipment,
      message: "Created equipment successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.readEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await prisma.equipment.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        equipmentCategory: true,
        images: {
          select: {
            url: true,
          },
        },
      },
    });

    if (!equipment) {
      return res.status(404).json({
        message: "No equipment not found",
      });
    }

    res.send(equipment);
  } catch (error) {
    console.log(error);
  }
};

exports.listEquipment = async (req, res) => {
  try {
    const { query, page = 1, limit = 5 } = req.query;


    let whereCondition = {};

    if (query) {
      whereCondition = {
        OR: [
          { name: { contains: query } },
          { equipmentNumber: { contains: query } },
          { address: { contains: query } },
          {
            equipmentCategory: {
              name: { contains: query },
            },
          },
          // { statusEquipment: { contains: query } },
        ],
      };
    }

    const take = parseInt(limit); // จำนวนที่ต้องการดึง
    const skip = (parseInt(page) - 1) * take; // คำนวณ offset

    const equipment = await prisma.equipment.findMany({
      where: whereCondition,

      select: {
        id: true,
        name: true,
        equipmentNumber: true,
        address: true,
        statusEquipment: true,
        equipmentCategory: true,
        images: {
          select: {
            url: true,
          },
        },
        // ดึง reportRepairs และ repairHistory
        reportRepairs: {
          select: {
            id: true, // ตรวจสอบว่ามีรายการแจ้งซ่อมหรือไม่
            repairHistory: {
              select: {
                id: true, // ตรวจสอบว่ามีประวัติซ่อมหรือไม่
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take, // ✅ ใช้ Prisma pagination
      skip,
    });

    const count = await prisma.equipment.count({where: whereCondition });

    // แปลงข้อมูลเพื่อเพิ่ม hasRepairHistory และ canDelete
    const formattedEquipment = equipment.map((item) => {
      const hasReportRepairs = item.reportRepairs.length > 0;
      const hasRepairHistory = item.reportRepairs.some(
        (report) => report.repairHistory.length > 0
      );

      return {
        ...item,
        hasRepairHistory, // มีประวัติซ่อมหรือไม่
        canDelete: !hasReportRepairs && !hasRepairHistory, // ลบได้ถ้าไม่มีแจ้งซ่อมและไม่มีประวัติซ่อม
      };
    });

    res.json({
      totalEquipment: count,
      equipment: formattedEquipment,
      totalPages: Math.ceil(count / take), // จำนวนหน้าทั้งหมด
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching equipment:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
};

exports.getEquipmentByCategory = async (req, res) => {
  try {
    const { id } = req.params; // รับ categoryId จาก URL params

    const equipment = await prisma.equipment.findMany({
      where: {
        equipmentCategoryId: Number(id), // กรองตาม categoryId
        statusEquipment: {
          notIn: ["REPAIRING", "BROKEN"], // ไม่เอาอุปกรณ์ที่กำลังซ่อมหรือเสีย
        },
      },
      select: {
        id: true,
        name: true,
        equipmentNumber: true, // ดึงเฉพาะข้อมูลที่ต้องการ
      },
    });

    res.json({
      equipment,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      equipmentNumber,
      address,
      equipmentCategoryId,
      statusEquipment,
      images,
    } = req.body;

    const checkEquipment = await prisma.equipment.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!checkEquipment) {
      return res.status(404).json({
        message: "Equipment Not found",
      });
    }

    const equipment = await prisma.equipment.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
        equipmentNumber: equipmentNumber,
        address: address,
        equipmentCategoryId: equipmentCategoryId,
        statusEquipment: statusEquipment,
        //1 อุปกรณ์มีได้หลายรูป loop เข้าไป
        images: {
          create: (images ?? []).map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });

    res.json({
      equipment,
      message: "Updated equipment successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const checkEquipment = await prisma.equipment.findUnique({
      where: {
        id: Number(id),
      },
    });

    const equipmentReport = await prisma.reportRepair.findMany({
      where: {
        equipmentId: Number(id),
      },
    });

    if (equipmentReport.length > 0) {
      return res.status(400).json({ message: "ไม่สามารถลบได้!" });
    }

    const equipment = await prisma.equipment.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      equipment,
      message: "Deleted equipment successfully",
    });
  } catch (error) {}
};

exports.historyEquipmentRepair = async (req, res) => {
  try {
    const { id } = req.params;

    //ค้นหาอุปกรณ์ตาม ID
    const checkEquipment = await prisma.equipment.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!checkEquipment) {
      return res.status(404).json({ message: "ไม่พบอุปกรณ์นี้" });
    }

    // ค้นหารายการแจ้งซ่อมที่เกี่ยวข้องกับอุปกรณ์นี้
    const equipmentReport = await prisma.reportRepair.findMany({
      where: {
        equipmentId: Number(id),
      },
    });
    console.log("checkEquipment", checkEquipment);
    console.log("equipmentReport", equipmentReport);

    // ดึง ID ของรายการแจ้งซ่อมออกมาเป็น array
    const reportRepairIds = equipmentReport.map((report) => report.id);

    // ถ้าไม่มีรายการแจ้งซ่อมเลย ก็ส่งข้อมูลกลับ
    if (reportRepairIds.length === 0) {
      return res.json({
        checkEquipment,
        equipmentReport,
        historyEquipment: [],
      });
    }

    // ค้นหาประวัติการซ่อมที่อ้างอิงถึง reportRepairId ในรายการที่ดึงมา
    const historyEquipment = await prisma.repairHistory.findMany({
      where: {
        reportRepairId: { in: reportRepairIds }, // ใช้ in เพื่อค้นหาหลายค่า
      },
      include: {
        reportRepair: {
          include: {
            equipment: true,
            reporterBy: true, // เพิ่มตรงนี้
            images: true,
          },
        },
        technician: true,
      },
    });
    console.log("historyEquipment", historyEquipment);
    res.json({
      historyEquipment,
    });
  } catch (error) {}
};

exports.statusEquipment = async (req, res) => {
  try {
    const statusEquipment = [
      { id: "ACTIVE", name: "กำลังใช้งาน" },
      { id: "INACTIVE", name: "ไม่ได้ใช้งาน" },
      { id: "REPAIRING", name: "กำลังซ่อมแซม" },
      { id: "BROKEN", name: "เสียหาย" },
    ];
    res.json(statusEquipment);
  } catch (error) {
    console.log(error);
  }
};
