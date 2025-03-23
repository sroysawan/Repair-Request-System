const prisma = require("../config/prisma");

exports.create = async (req, res) => {
  try {
    const { name, equipmentId, problem, address, assignmentStatus, images } =
      req.body;

    const { id } = req.user;
    if (!id) {
      return res.status(400).json({ message: "User is not authenticated" });
    }

    const report = await prisma.reportRepair.create({
      data: {
        reporterByUserId: Number(id),
        name: name,
        equipmentId: equipmentId,
        problem: problem,
        address: address,
        assignmentStatus: assignmentStatus,
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
          : undefined,
      },
    });

    // อัปเดตสถานะอุปกรณ์เป็น REPAIRING
    await prisma.equipment.update({
      where: { id: equipmentId },
      data: { statusEquipment: "REPAIRING" },
    });
    res.json({
      report,
      message: "Created Report Repair successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.listReportRepair = async (req, res) => {
  try {
    const reports = await prisma.reportRepair.findMany({
      include: {
        reporterBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userName: true,
          },
        },
        equipment: true,
        images: true,
      },
    });
    const count = await prisma.reportRepair.count();
    res.json({
      totalReport: count,
      reports,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.listReportRepairNews = async (req, res) => {
  try {
    const { query, page = 1, limit = 5 } = req.query;
    let whereCondition = {};

    
    if (query) {
      whereCondition = {
        OR: [
          { equipment: { name: { contains: query } } },
          { equipment: { equipmentNumber: { contains: query } } },
          { equipment:
            { equipmentCategory:
               { name: { contains: query } } 
           } 
         },
         { name: { contains: query } },
         { address: { contains: query } },
        ],
      };
    }

    const take = parseInt(limit); // จำนวนที่ต้องการดึง
    const skip = (parseInt(page) - 1) * take; // คำนวณ offset

    const reports = await prisma.reportRepair.findMany({
      where: {
        ...whereCondition,
        assignmentStatus: "PENDING",
      },
      include: {
        reporterBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userName: true,
          },
        },
        equipment: {
          include: {
            equipmentCategory: true,
          },
        },
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take, // ✅ ใช้ Prisma pagination
      skip,
    });
    const count = await prisma.reportRepair.count({
      where: {
        ...whereCondition,
        assignmentStatus: "PENDING",
      },
    });


    res.json({
      totalReport: count,
      reports,
      totalPages: Math.ceil(count / take), // จำนวนหน้าทั้งหมด
      currentPage: parseInt(page),

    });
  } catch (error) {
    console.log(error);
  }
};

exports.readReportRepair = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await prisma.reportRepair.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        reporterBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userName: true,
          },
        },
        equipment: {
          include: {
            equipmentCategory: true,
          },
        },
        images: true,
        assignment: {
          include: {
            technician: true, // ดึงข้อมูลช่างที่รับงาน
          },
        },
        repairHistory: {
          include: {
            technician: true, // ช่างที่เคยทำงานและถูกบันทึกใน repairHistory
          },
        },
      },
    });

    if (!report) {
      return res.status(404).json({
        message: "Report Repair Not Found",
      });
    }

    // ✅ **ดึงชื่อช่างมาแสดง ถ้ามีช่างใน assignment ให้ใช้ assignment ถ้าไม่มีให้ใช้ repairHistory**
    report.technician =
      report.assignment.length > 0
        ? report.assignment
            .map((a) => `${a.technician.firstName} ${a.technician.lastName}`)
            .join(", ")
        : report.repairHistory.length > 0
        ? report.repairHistory
            .map((h) => `${h.technician.firstName} ${h.technician.lastName}`)
            .join(", ")
        : "-";
        
    res.send(report);
  } catch (error) {
    console.log(error);
  }
};

exports.listReportRepairByUser = async (req, res) => {
  try {
    const { id } = req.user;
    const { query, page = 1, limit = 5 } = req.query;

    if (!id) {
      return res.status(400).json({ message: "User is not authenticated" });
    }

    let whereCondition = {};
    if (query) {
      whereCondition = {
        OR: [
          { equipment: { name: { contains: query } } },
          { equipment: { equipmentNumber: { contains: query } } },
          { equipment: { equipmentCategory: { name: { contains: query } } } },
          { name: { contains: query } },
          { address: { contains: query } },
          { problem: { contains: query } },
    
          // ✅ ค้นหาชื่อช่างจาก assignment
          {
            assignment: {
              some: {
                technician: {
                  OR: [
                    { firstName: { contains: query } },
                    { lastName: { contains: query } },
                  ],
                },
              },
            },
          },
    
          // ✅ ค้นหาชื่อช่างจาก repairHistory
          {
            repairHistory: {
              some: {
                technician: {
                  OR: [
                    { firstName: { contains: query } },
                    { lastName: { contains: query } },
                  ],
                },
              },
            },
          },
        ],
      };
    }
    
    const take = parseInt(limit); // จำนวนที่ต้องการดึง
    const skip = (parseInt(page) - 1) * take; // คำนวณ offset


    const reports = await prisma.reportRepair.findMany({
      where: {
        ...whereCondition,
        reporterByUserId: Number(id),
      },
      include: {
        equipment: {
          include: {
            equipmentCategory: true,
          },
        },
        images: true,
        assignment: {
          include: {
            technician: true, // ดึงข้อมูลช่างที่รับงาน
          },
        },
        repairHistory: {
          include: {
            technician: true, // ช่างที่เคยทำงานและถูกบันทึกใน repairHistory
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take, // ✅ ใช้ Prisma pagination
      skip,
    });

    // ✅ **ดึงชื่อช่างมาแสดง ถ้ามีช่างใน assignment ให้ใช้ assignment ถ้าไม่มีให้ใช้ repairHistory**
    const report = reports.map((r) => ({
      ...r,
      technician:
        r.assignment.length > 0
          ? r.assignment
              .map((a) => `${a.technician.firstName} ${a.technician.lastName}`)
              .join(", ")
          : r.repairHistory.length > 0
          ? r.repairHistory
              .map((h) => `${h.technician.firstName} ${h.technician.lastName}`)
              .join(", ")
          : "-",
    }));

    const count = await prisma.reportRepair.count({
      where: {
        ...whereCondition,
        reporterByUserId: Number(id),
      },
    });

    const countReport = await prisma.reportRepair.count({
      where: {
        reporterByUserId: Number(id),
        assignmentStatus: "PENDING",
      },
    });
    const countReportProgress = await prisma.reportRepair.count({
      where: {
        reporterByUserId: Number(id),
        assignmentStatus: "IN_PROGRESS",
      },
    });
    const countReportComp = await prisma.reportRepair.count({
      where: {
        reporterByUserId: Number(id),
        assignmentStatus: {
          in: ["COMPLETED", "CANCELLED"],
        },
      },
    });

    res.json({
      report,
      totalReport: count,
      totalPages: Math.ceil(count / take), // จำนวนหน้าทั้งหมด
      currentPage: parseInt(page),
      countReport,
      countReportProgress,
      countReportComp
    });
  } catch (error) {
    console.log(error)
  }
};
