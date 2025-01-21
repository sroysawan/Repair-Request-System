const prisma = require("../config/prisma");

exports.create = async (req, res) => {
  try {
    const {
      name,
      equipmentId,
      problem,
      address,
      assignmentStatus,
      images,
    } = req.body;


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
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });
    res.json({
      report,
      message: "Created Report Repair successfully",
    });
  } catch (error) {
    console.log(error);
  }
};


exports.listReportRepair =async(req,res)=>{
    try {
        const reports = await prisma.reportRepair.findMany({
            include: {
                reporterBy : {
                    select: {
                        id:true,
                        firstName: true,
                        lastName: true,
                        userName: true,

                    }
                },
                equipment: true,
                images: true, 
            }
        });
        const count = await prisma.reportRepair.count()
        res.json({
            totalReport: count,
            reports
        })
    } catch (error) {
        console.log(error)
    }
}

exports.readReportRepair = async(req,res)=>{
    try {
        const { id } = req.params
        const report = await prisma.reportRepair.findFirst({
            where : {
                id: Number(id)
            },
            include: {
                reporterBy : {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        userName: true,
                        
                    }
                },
                 equipment: true,
                images: true, 
            }
        })

        if(!report){
            return res.status(404).json({
                message: "Report Repair Not Found"
            })
        }
        res.send(report)
    } catch (error) {
        console.log(error)
    }
}

exports.listReportRepairByUser =async(req,res)=>{
    try {
        const { id } = req.user;
        if (!id) {
          return res.status(400).json({ message: "User is not authenticated" });
        }

        const report = await prisma.reportRepair.findMany({
            where: {
                reporterByUserId: Number(id)
            },
            include: {
                equipment: true,
                images: true, 
            }

        })

        res.send(report)
    } catch (error) {
        
    }
}

