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
    const { public_id } = req.body;
    // console.log(public_id)
    cloudinary.uploader.destroy(public_id, (result) => {
      res.send("Remove Image Success");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

