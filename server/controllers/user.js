const prisma = require('../config/prisma')

exports.listUser =async(req,res)=>{
    try {
        const { role } = req.user; // role จะมาจาก token ที่ decode แล้วใน `authCheck`
        let users;
        if (role === 'ADMIN') {
            // Admin: ดูรายชื่อผู้ใช้ทั้งหมด
            users = await prisma.user.findMany({
            select:{
                id:true,
                pictureId:true,
                firstName:true,
                lastName:true,
                userName:true,
                email:true,
                department:true,
                position:true,
                role:true   ,
                enabled:true           
            }
        })
    } else if (role === 'SUPERVISOR') {
        // Technician Lead: ดูเฉพาะผู้ใช้ที่เป็น "ช่าง"
        users = await prisma.user.findMany({
          where: {
            role: 'TECHNICIAN', // เงื่อนไข: แสดงเฉพาะช่าง
          },
          select: {
            id: true,
            pictureId: true,
            firstName: true,
            lastName: true,
            department: true,
            position: true,
            role: true,
            enabled: true,
          },
        });
      } else {
        return res.status(403).json({
          message: "Access Denied: Unauthorized role",
        });
      }
        res.send(users)
    } catch (error) {
        console.log(error)
    }
}