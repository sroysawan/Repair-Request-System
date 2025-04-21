const { request } = require("express");
const prisma = require("../config/prisma");

//ทุกขั้นตอนจะถูกดำเนินการพร้อมกัน ถ้าขั้นตอนใดล้มเหลว ข้อมูลทั้งหมดจะถูกย้อนกลับ
exports.completeAssignment = async (req, res) => {
  try {
    const { assignmentId, solution, status } = req.body;
    const { id } = req.user; // Assuming the user is authenticated and has an ID

    //ถ้าไม่มี id
    if (!id) {
      return res.status(400).json({ message: "User is not authenticated" });
    }

    const transaction = await prisma.$transaction(async (prisma) => {
      // ดึงข้อมูลของ assignment
      const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
        include: {
          reportRepair: {
            include: { equipment: true }, // ดึงข้อมูลอุปกรณ์ที่เกี่ยวข้องด้วย
          },
          technician: true,
        },
      });

      console.log(assignment);

      //ถ้าไม่มี assignment
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      //ตรวจสอบว่า technicianId ใน Assignment ตรงกับ userId ของผู้ที่ล็อกอินหรือไม่
      if (assignment.technicianId !== id) {
        return res
          .status(403)
          .json({ message: "You are not authorized to complete this job" });
      }

      // บันทึกข้อมูลเข้า repairHistory
      const repairHistory = await prisma.repairHistory.create({
        data: {
          //ข้อมูลที่จะสำเนา
          reportRepairId: assignment.reportRepairId,
          title: assignment.reportRepair.name, // Copy the problem name
          description: assignment.reportRepair.problem, // Copy the problem description
          reporterUserId: assignment.reportRepair.reporterByUserId, // Copy reporter info
          technicianId: assignment.technicianId, // Copy technician info
          status: status, // Completed or Cancelled
          solution: solution, // Solution description
          assignedAt: assignment.assignedAt,
        },
      });

      // Step 3: อัปเดตสถานะของ ReportRepair
      await prisma.reportRepair.update({
        where: { id: assignment.reportRepairId },
        data: {
          assignmentStatus: status === "COMPLETED" ? "COMPLETED" : "CANCELLED",
        },
      });

      // อัปเดตสถานะของอุปกรณ์
      if (assignment.reportRepair.equipment) {
        await prisma.equipment.update({
          where: { id: assignment.reportRepair.equipmentId },
          data: {
            statusEquipment: status === "COMPLETED" ? "ACTIVE" : "BROKEN",
          },
        });
      }

      // Step 4: ลบ Assignment เนื่องจากเสร็จสิ้นแล้ว
      await prisma.assignment.delete({
        where: { id: assignmentId },
      });
      return repairHistory;
    });

    //update ถ้างานเสร็จให้เปลี่ยนสถานะอุปกรณ์เป็น กำลังใช้งาน แต่ถ้ายกเลิกงานให้สถานะอุปกรณ์เป็น ไม่ได้ใช้งาน

    res.json({
      repairHistory: transaction,
      message: "Assignment completed and moved to RepairHistory successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.completeAssignmentBySupervisor = async (req, res) => {
  try {
    const { assignmentId, solution, status } = req.body;
    const { role } = req.user; // ไม่ต้องใช้ id เพราะ Supervisor ไม่ได้เป็นเจ้าของงาน

    // ตรวจสอบว่า user มีบทบาทเป็น SUPERVISOR
    if (role !== "SUPERVISOR") {
      return res.status(403).json({
        message:
          "Only supervisors can complete this assignment on behalf of technicians",
      });
    }

    const transaction = await prisma.$transaction(async (prisma) => {
      // ดึงข้อมูลของ assignment
      const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
        include: {
          reportRepair: {
            include: { equipment: true }, // ดึงข้อมูลอุปกรณ์ที่เกี่ยวข้องด้วย
          },
          technician: true,
        },
      });

      console.log(assignment);

      //ถ้าไม่มี assignment
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      // ตรวจสอบว่ามี technician รับงานนี้จริง
      if (!assignment.technicianId) {
        return res
          .status(400)
          .json({ message: "This assignment has no assigned technician" });
      }

      // บันทึกข้อมูลเข้า repairHistory
      const repairHistory = await prisma.repairHistory.create({
        data: {
          //ข้อมูลที่จะสำเนา
          reportRepairId: assignment.reportRepairId,
          title: assignment.reportRepair.name, // Copy the problem name
          description: assignment.reportRepair.problem, // Copy the problem description
          reporterUserId: assignment.reportRepair.reporterByUserId, // Copy reporter info
          technicianId: assignment.technicianId, // Copy technician info
          status: status, // Completed or Cancelled
          solution: `${solution}\n(Completed by Supervisor)`,
          assignedAt: assignment.assignedAt,
        },
      });

      // Step 3: อัปเดตสถานะของ ReportRepair
      await prisma.reportRepair.update({
        where: { id: assignment.reportRepairId },
        data: {
          assignmentStatus: status === "COMPLETED" ? "COMPLETED" : "CANCELLED",
        },
      });

      // อัปเดตสถานะของอุปกรณ์
      if (assignment.reportRepair.equipment) {
        await prisma.equipment.update({
          where: { id: assignment.reportRepair.equipmentId },
          data: {
            statusEquipment: status === "COMPLETED" ? "ACTIVE" : "BROKEN",
          },
        });
      }

      // Step 4: ลบ Assignment เนื่องจากเสร็จสิ้นแล้ว
      await prisma.assignment.delete({
        where: { id: assignmentId },
      });
      return repairHistory;
    });

    //update ถ้างานเสร็จให้เปลี่ยนสถานะอุปกรณ์เป็น กำลังใช้งาน แต่ถ้ายกเลิกงานให้สถานะอุปกรณ์เป็น ไม่ได้ใช้งาน

    res.json({
      repairHistory: transaction,
      message: "Assignment completed and moved to RepairHistory successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.listRepairHistory = async (req, res) => {
  try {
    const { query, page = 1, limit = 5 } = req.query;
    let whereCondition = {};

    if (query) {
      whereCondition = {
        OR: [
          // ✅ ค้นหาชื่ออุปกรณ์จาก reportRepair.name
          { reportRepair: { name: { contains: query } } },
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
          { title: { contains: query } },
          { description: { contains: query } },
          { solution: { contains: query } },
        ],
      };
    }
    const take = parseInt(limit); // จำนวนที่ต้องการดึง
    const skip = (parseInt(page) - 1) * take; // คำนวณ offset

    const history = await prisma.repairHistory.findMany({
      where: whereCondition,
      include: {
        reportRepair: {
          include: {
            equipment: {
              include: {
                equipmentCategory: true,
              },
            },
            reporterBy: true, // เพิ่มตรงนี้
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

    const totalRepairHistory = await prisma.repairHistory.count({
      where: whereCondition,
    });
    res.json({
      totalRepairHistory,
      history,
      totalPages: Math.ceil(totalRepairHistory / take), // จำนวนหน้าทั้งหมด
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log(error);
  }
};

exports.listRepairHistoryByTechnician = async (req, res) => {
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
          // ✅ ค้นหาชื่ออุปกรณ์จาก reportRepair.name
          { reportRepair: { name: { contains: query } } },
          { reportRepair: { reporterBy: { firstName: { contains: query } } } },
          { reportRepair: { reporterBy: { lastName: { contains: query } } } },

          // // ✅ ค้นหาชื่อช่าง
          { technician: { firstName: { contains: query } } },
          { technician: { lastName: { contains: query } } },

          // ✅ ค้นหาตามข้อมูลอื่นๆ
          { title: { contains: query } },
          { description: { contains: query } },
          { solution: { contains: query } },
        ],
      };
    }
    const take = parseInt(limit); // จำนวนที่ต้องการดึง
    const skip = (parseInt(page) - 1) * take; // คำนวณ offset

    const report = await prisma.repairHistory.findMany({
      where: {
        ...whereCondition,
        technicianId: Number(id),
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
      orderBy: {
        createdAt: "desc",
      },
      take, // ✅ ใช้ Prisma pagination
      skip,
    });

    const totalRepairHistory = await prisma.repairHistory.count({
      where: {
        ...whereCondition,
        technicianId: Number(id),
      },
    });

    res.json({
      totalRepairHistory,
      report,
      totalPages: Math.ceil(totalRepairHistory / take), // จำนวนหน้าทั้งหมด
      currentPage: parseInt(page),
    });
  } catch (error) {}
};

exports.readRepairHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await prisma.repairHistory.findFirst({
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
            reporterBy: true, // เพิ่มตรงนี้
            images: true,
          },
        },
        technician: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.send(history);
  } catch (error) {
    console.log(error);
  }
};

53;
