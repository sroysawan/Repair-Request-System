const prisma = require("../config/prisma");

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
    });
  } catch (error) {
    console.log(error);
  }
};

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
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while assigning the job" });
  }
};

exports.listAssignment = async (req, res) => {
  try {
    const assignment = await prisma.assignment.findMany();
    res.send(assignment)
  } catch (error) {
    console.log(error);
  }
};

exports.readAssignment = async (req, res) => {
    try {
        const { id } = req.params
        const assignment = await prisma.assignment.findFirst({
            where: {
                id: Number(id)
            }
        })
        res.send(assignment)
    } catch (error) {
        console.log(error)
    }
}

exports.listAssignmentByTechnician = async(req,res)=>{
    try {
        const { id,role }= req.user

        if(role !== 'TECHNICIAN'){
            return res.status(404).json({
                message: 'You are not allowed to list assignments'
            })
        }


        const assignment = await prisma.assignment.findMany({
            where: {
                technicianId : Number(id)
            }
        })

        res.send(assignment)
    } catch (error) {
        console.log(error)
    }
}

exports.updateAssignment = async(req,res)=>{
    try {
        const { id } = req.params
    } catch (error) {
        console.log(error)
    }
}
