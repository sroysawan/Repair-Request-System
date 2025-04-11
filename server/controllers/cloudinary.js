const prisma = require("../config/prisma");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});
exports.createImages = async (req, res) => {
  try {
    // console.log(req.body.image);
    const { image } = req.body;
    const result = await cloudinary.uploader.upload(image, {
      public_id: `${Date.now()}`,
      response_type: "auto",
      folder: "ReportRepair",
    });
    res.json({
      message: "Upload Image Successfully",
      result: result,
    });
  } catch (error) {
    console.log(error)
  }
};

exports.removeImage = async (req, res) => {
  try {
    const { public_id, userId } = req.body;

    console.log("REQ BODY", req.body);

    // ✅ เช็คก่อนว่ามี public_id จริงไหม
    if (!public_id) {
      return res.status(400).json({ message: "Missing required parameter - public_id" });
    }

    // 1. ลบจาก Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);
    console.log("Cloudinary result:", result);

    // 2. ค้นหารูปจาก public_id
    const image = await prisma.image.findFirst({
      where: { public_id },
    });

    console.log("Found image from DB:", image);

    if (image) {
      // 3. ลบ pictureId จาก user
      await prisma.user.update({
        where: { id: userId },
        data: { pictureId: null },
      });

      // 4. ลบ image record จาก DB
      await prisma.image.delete({
        where: { id: image.id },
      });
    }

    res.json({ message: "Remove Image & Update DB success" });

  } catch (error) {
    console.log("❌ ERROR in removeImage:", error);
    res.status(500).json({ message: "Server Error" });
  }
};





