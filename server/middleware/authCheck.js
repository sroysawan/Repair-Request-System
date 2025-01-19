const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

//check login หรือเปล่า
exports.authCheck = async (req, res, next) => {
  try {
    //รับ token
    const headerToken = req.headers.authorization;

    //ถ้าไม่มี token
    if (!headerToken) {
      return res.status(401).json({
        message: "No Token, Authorization",
      });
    }

    //ปกติจะได้ค่าเป็น Bearer dsf545 ทีนี้ต้องการแค่ Token จึงเอาแค่ index[1]
    const token = headerToken.split(" ")[1];

    // เอา token มาถอดรหัส
    const decode = jwt.verify(token, process.env.SECRET);

    //จะใช้ req.user แทน decode และมันจะไปทุกๆหน้า
    req.user = decode;

    // decode {
    //     id: 1,
    //     name: 'Sroysawan',
    //     username: 'sroysawan',
    //     role: 'ADMIN',
    //     iat: 1737265799,
    //     exp: 1737870599
    //   }
    console.log("decode", decode);
// ตรวจสอบ user ในฐานข้อมูล
    const user = await prisma.user.findFirst({
      where: {
        userName: req.user.username,
      },
    });

    // ถ้า user ไม่ได้เปิดใช้งาน
    if (!user.enabled) {
      return res.status(400).json({
        message: "This account does not access",
      });
    }

    next();
  } catch (error) {
    // token หมดอายุ (exp เกินเวลาที่กำหนดไว้)
    if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token Expired",
        });
      }

    console.log(error);
    res.status(500).json({
      message: "Token Invalid",
    });
  }
};


exports.roleCheck = (roles) => {
  return (req, res, next) => {
    try {
      const { role } = req.user;

      //ถ้า role ไม่อนุญาต
      if (!roles.includes(role)) {
        return res.status(403).json({
          message: "Access Denied: Unauthorized role",
        });
      }

      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error Admin access denied",
      });
    }
  };
};
