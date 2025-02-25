const prisma = require("../config/prisma");

exports.listRoles = async (req, res) => {
  try {
    const { role } = req.user;
    let roles;

    if (role === "ADMIN") {
      roles = [
        { id: "ADMIN", name: "ผู้ดูแลระบบ" },
        { id: "SUPERVISOR", name: "หัวหน้างาน" },
        { id: "TECHNICIAN", name: "ช่างเทคนิค" },
        { id: "USER", name: "ผู้ใช้งานทั่วไป" },
      ];
    } else if (role === "SUPERVISOR") {
      roles = [
        { id: "SUPERVISOR", name: "หัวหน้างาน" },
        { id: "TECHNICIAN", name: "ช่างเทคนิค" },
      ];
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
