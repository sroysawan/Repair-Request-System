const prisma = require('../config/prisma')


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
          reportRepair: true, 
          technician: true,   
        }
      });

      console.log(assignment)
  
      //ถ้าไม่มี assignment
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      //ตรวจสอบว่า technicianId ใน Assignment ตรงกับ userId ของผู้ที่ล็อกอินหรือไม่
      if (assignment.technicianId !== id) {
        return res.status(403).json({ message: "You are not authorized to complete this job" });
      }
  
      const repairHistory = await prisma.repairHistory.create({
        data: {
        //ข้อมูลที่จะสำเนา
          reportRepairId: assignment.reportRepairId,
          title: assignment.reportRepair.name, // Copy the problem name
          description: assignment.reportRepair.problem, // Copy the problem description
          reporterId: assignment.reportRepair.reporterByUserId,
          reporterUserId: assignment.reportRepair.reporterByUserId, // Copy reporter info
          technicianId: assignment.technicianId, // Copy technician info
          status: status, // Completed or Cancelled
          solution: solution, // Solution description
          assignedAt: assignment.assignedAt,
        }
      });
  
      // Step 3: Update the status of the related ReportRepair to 'COMPLETED' or 'CANCELLED'
      await prisma.reportRepair.update({
        where: { id: assignment.reportRepairId },
        data: {
          assignmentStatus: status === 'COMPLETED' ? 'COMPLETED' : 'CANCELLED',
        }
      });
  
      // Step 4: Delete the assignment as it has been completed and transferred to RepairHistory
      await prisma.assignment.delete({
        where: { id: assignmentId }
      });
      return repairHistory;
    });
  
      res.json({
        repairHistory: transaction,
        message: "Assignment completed and moved to RepairHistory successfully",
    });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };