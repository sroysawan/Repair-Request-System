const prisma = require("../config/prisma");

exports.listRoles = async (req, res) => {
  try {
    const { role } = req.user;
    let roles;

    if (role === "ADMIN") {
      roles = ["ADMIN", "SUPERVISOR", "TECHNICIAN", "USER"]; // Admin เห็นทั้งหมด
    } else if (role === "SUPERVISOR") {
      roles = ["SUPERVISOR", "TECHNICIAN"]; // Supervisor เห็นแค่บาง role
    } else {
      return res.status(403).json({
        message: "Access Denied: Unauthorized role",
      });
    }

    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
