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
      equipment,
      message: "Created equipment successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.readEquipment = async(req,res)=>{
  try {
    const {id} = req.params
    const equipment = await prisma.equipment.findFirst({
      where: {
        id: Number(id)
      }
    })

    if(!equipment) {
      return res.status(404).json({
        message: "No equipment not found"
      })
    }

    res.send(equipment)
  } catch (error) {
    console.log(error)
  }
}

exports.listEquipment = async (req, res) => {
  try {
    const equipment = await prisma.equipment.findMany();

    const count = await prisma.equipment.count();

    res.json({
      totalEquipment: count,
      equipment,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getEquipmentByCategory = async (req, res) => {
  try {
    const { id } = req.params; // รับ categoryId จาก URL params

    const equipment = await prisma.equipment.findMany({
      where: {
        equipmentCategoryId: Number(id), // กรองตาม categoryId
      },
      select: {
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

exports.updateEquipment=async(req,res)=>{
  try {
    const { id } = req.params
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
        id: Number(id)
      },
      data:{
        name: name,
        equipmentNumber: equipmentNumber,
        address: address,
        equipmentCategoryId: equipmentCategoryId,
        statusEquipment: statusEquipment,
        //1 อุปกรณ์มีได้หลายรูป loop เข้าไป
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      }
    })

    res.json({
      equipment,
      message: "Updated equipment successfully"
    })
  } catch (error) {
    console.log(error)
  }
}

//delete
