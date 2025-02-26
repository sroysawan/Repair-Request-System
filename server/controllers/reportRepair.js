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
    const reports = await prisma.reportRepair.findMany({
      where: {
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
        equipment: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const count = await prisma.reportRepair.count({
      where: {
        assignmentStatus: "PENDING",
      },
    });
    res.json({
      totalReport: count,
      reports,
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
    if (!id) {
      return res.status(400).json({ message: "User is not authenticated" });
    }

    const reports = await prisma.reportRepair.findMany({
      where: {
        reporterByUserId: Number(id),
      },
      include: {
        equipment: true,
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

    res.send(report);
  } catch (error) {}
};
