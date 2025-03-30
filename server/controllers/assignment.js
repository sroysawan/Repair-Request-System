const prisma = require("../config/prisma");

//supervisor จ่ายงานให้ช่างเอง
exports.assignRepairJob = async (req, res) => {
  try {
    const { technicianId, reportRepairId } = req.body;
    // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบหรือไม่
    if (!technicianId || !reportRepairId) {
      return res
        .status(400)
        .json({ message: "Technician ID and Report Repair ID are required" });
    }

    // ตรวจสอบว่ามีงานแจ้งซ่อมอยู่จริงหรือไม่
    const reportRepair = await prisma.reportRepair.findUnique({
      where: { id: Number(reportRepairId) },
      select: { equipmentId: true }, // ดึง equipmentId มาด้วย
    });

    if (!reportRepair) {
      return res.status(404).json({ message: "Report Repair not found" });
    }

    // ตรวจสอบว่างานนี้ถูก Assign ไปแล้วหรือยัง
    const existingAssignment = await prisma.assignment.findFirst({
      where: { reportRepairId: Number(reportRepairId) },
    });

    if (existingAssignment) {
      return res
        .status(400)
        .json({ message: "This job has already been assigned" });
    }

    // ตรวจสอบว่าผู้ใช้นั้นมีบทบาทเป็นช่างหรือไม่
    const technician = await prisma.user.findUnique({
      where: { id: Number(technicianId) },
      select: { role: true },
    });

    if (!technician || technician.role !== "TECHNICIAN") {
      return res
        .status(400)
        .json({ message: "Assigned user is not a technician" });
    }

    // ใช้ transaction เพื่อทำงานหลายส่วนพร้อมกัน
    const result = await prisma.$transaction([
      // อัปเดตสถานะ assignmentStatus ใน reportRepair
      prisma.reportRepair.update({
        where: { id: Number(reportRepairId) },
        data: { assignmentStatus: "IN_PROGRESS" },
      }),

      // อัปเดตสถานะของอุปกรณ์เป็น "REPAIRING"
      prisma.equipment.update({
        where: { id: reportRepair.equipmentId }, // ใช้ equipmentId ที่ดึงมา
        data: { statusEquipment: "REPAIRING" },
      }),

      // สร้างรายการใหม่ใน assignment
      prisma.assignment.create({
        data: {
          reportRepairId: Number(reportRepairId),
          technicianId: Number(technicianId),
          status: "IN_PROGRESS", // หรือสถานะอื่นตามที่กำหนด
        },
      }),
    ]);

    res.json({
      message: "Assigned repair job successfully",
      updatedReportRepair: result[0],
      newAssignment: result[1],
      updatedEquipment: result[2], // เพิ่มการคืนค่า
    });
  } catch (error) {
    console.log(error);
  }
};

//ช่างรับงานเอง
exports.assignJobByTechnician = async (req, res) => {
  try {
    const { reportRepairId } = req.body;

    // ดึง technicianId จาก req.user
    const { id: technicianId, role } = req.user;

    // ตรวจสอบว่า user มีบทบาทเป็น TECHNICIAN
    if (role !== "TECHNICIAN") {
      return res
        .status(403)
        .json({ message: "Only technicians can assign jobs" });
    }

    // ตรวจสอบว่างานแจ้งซ่อมมีอยู่จริงหรือไม่
    const reportRepair = await prisma.reportRepair.findUnique({
      where: { id: Number(reportRepairId) },
    });

    if (!reportRepair) {
      return res.status(404).json({ message: "Report Repair not found" });
    }

    // ตรวจสอบว่างานนี้ถูก Assign ไปแล้วหรือยัง
    const existingAssignment = await prisma.assignment.findFirst({
      where: { reportRepairId: Number(reportRepairId) },
    });

    if (existingAssignment) {
      return res
        .status(400)
        .json({ message: "This job has already been assigned" });
    }

    // ใช้ transaction เพื่ออัปเดตและสร้าง assignment
    const result = await prisma.$transaction([
      // อัปเดตสถานะ assignmentStatus ใน reportRepair
      prisma.reportRepair.update({
        where: { id: Number(reportRepairId) },
        data: { assignmentStatus: "IN_PROGRESS" },
      }),

      // อัปเดตสถานะของอุปกรณ์เป็น "REPAIRING"
      prisma.equipment.update({
        where: { id: reportRepair.equipmentId }, // ใช้ equipmentId ที่ดึงมา
        data: { statusEquipment: "REPAIRING" },
      }),

      // สร้าง assignment โดยใช้ technicianId จาก req.user
      prisma.assignment.create({
        data: {
          reportRepairId: Number(reportRepairId),
          technicianId: technicianId,
          status: "IN_PROGRESS",
        },
      }),
    ]);

    res.json({
      message: "Job assigned successfully by technician",
      updatedReportRepair: result[0],
      newAssignment: result[1],
      updatedEquipment: result[2], // เพิ่มการคืนค่า
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while assigning the job" });
  }
};

//งานที่รับแล้วทั้งหมด
exports.listAssignment = async (req, res) => {
  try {
    const { query, page = 1, limit = 5 } = req.query;
    let whereCondition = {};
    if (query) {
      whereCondition = {
        OR: [
          // ✅ ค้นหาชื่ออุปกรณ์จาก reportRepair.name
          { reportRepair: { reporterBy: { firstName: { contains: query } } } },
          { reportRepair: { reporterBy: { lastName: { contains: query } } } },
          { reportRepair: { equipment: { name: { contains: query } } } },
          {
            reportRepair: {
              equipment: { equipmentNumber: { contains: query } },
            },
          },
          {
            reportRepair: {
              equipment: { equipmentCategory: { name: { contains: query } } },
            },
          },

          // // ✅ ค้นหาชื่อช่าง
          { technician: { firstName: { contains: query } } },
          { technician: { lastName: { contains: query } } },

          // ✅ ค้นหาตามข้อมูลอื่นๆ
          { reportRepair: { name: { contains: query } } },
          { reportRepair: { problem: { contains: query } } },
          { reportRepair: { address: { contains: query } } },
        ],
      };
    }
    const take = parseInt(limit); // จำนวนที่ต้องการดึง
    const skip = (parseInt(page) - 1) * take; // คำนวณ offset

    const assignment = await prisma.assignment.findMany({
      where: whereCondition,
      include: {
        reportRepair: {
          include: {
            equipment: {
              include: {
                equipmentCategory: true,
              },
            },
            reporterBy: true,
            images: true,
          },
        },
        technician: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take,
      skip,
    });
    const count = await prisma.assignment.count({ where: whereCondition });

    res.send({
      assignment,
      totalAssignmentAll: count,
      totalPages: Math.ceil(count / take), // จำนวนหน้าทั้งหมด
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log(error);
  }
};

//งานที่รับแล้ว By Id
exports.readAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        reportRepair: {
          include: {
            equipment: {
              include: {
                equipmentCategory: true,
              },
            },
            reporterBy: true,
            images: true,
          },
        },
        technician: true,
      },
    });
    res.send(assignment);
  } catch (error) {
    console.log(error);
  }
};

//งานที่ช่างแต่ละคนรับ
exports.listAssignmentByTechnician = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { query, page = 1, limit = 5 } = req.query;

    let whereCondition = {};
    if (query) {
      whereCondition = {
        OR: [
          // ✅ ค้นหาชื่ออุปกรณ์จาก reportRepair.name
          { reportRepair: { reporterBy: { firstName: { contains: query } } } },
          { reportRepair: { reporterBy: { lastName: { contains: query } } } },
          { reportRepair: { equipment: { name: { contains: query } } } },
          {
            reportRepair: {
              equipment: { equipmentNumber: { contains: query } },
            },
          },
          {
            reportRepair: {
              equipment: { equipmentCategory: { name: { contains: query } } },
            },
          },

          // // ✅ ค้นหาชื่อช่าง
          { technician: { firstName: { contains: query } } },
          { technician: { lastName: { contains: query } } },

          // ✅ ค้นหาตามข้อมูลอื่นๆ
          { reportRepair: { name: { contains: query } } },
          { reportRepair: { problem: { contains: query } } },
          { reportRepair: { address: { contains: query } } },
        ],
      };
    }
    const take = parseInt(limit); // จำนวนที่ต้องการดึง
    const skip = (parseInt(page) - 1) * take; // คำนวณ offset

    if (role !== "TECHNICIAN") {
      return res.status(404).json({
        message: "You are not allowed to list assignments",
      });
    }

    const assignment = await prisma.assignment.findMany({
      where: {
        ...whereCondition,
        technicianId: Number(id),
      },
      include: {
        reportRepair: {
          include: {
            equipment: {
              include: {
                equipmentCategory: true,
              },
            },
            reporterBy: true,
            images: true,
          },
        },
        technician: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take,
      skip,
    });
    const count = await prisma.assignment.count({
      where: {
        ...whereCondition,
        technicianId: Number(id),
      },
    });

    res.send({
      assignment,
      totalAssign: count,
      totalPages: Math.ceil(count / take), // จำนวนหน้าทั้งหมด
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log(error);
  }
};

exports.listAssignableStatuses = async (req, res) => {
  try {
    const assignableStatuses = [
      { id: "COMPLETED", name: "เสร็จสิ้น" },
      { id: "CANCELLED", name: "ยกเลิก" },
    ];

    res.json(assignableStatuses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.changeTechnicianAssignment = async (req, res) => {
  try {
    const { technicianId, assignmentId } = req.body;
    if (!technicianId || !assignmentId) {
      return res
        .status(400)
        .json({ message: "Technician ID and Assigment ID are required" });
    }
    // ตรวจสอบว่าผู้ใช้นั้นมีบทบาทเป็นช่างหรือไม่
    const technician = await prisma.user.findUnique({
      where: { id: Number(technicianId) },
      select: { role: true },
    });

    if (!technician || technician.role !== "TECHNICIAN") {
      return res
        .status(400)
        .json({ message: "Assigned user is not a technician" });
    }

    const assignment = await prisma.assignment.update({
      where: {
        id: Number(assignmentId),
      },
      data: {
        technicianId: technicianId,
      },
    });
    res.json({
      message: "Update Technician Success",
      assignment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
