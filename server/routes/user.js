const express = require("express");
const { listUser } = require("../controllers/user");
const { authCheck, roleCheck } = require("../middleware/authCheck");
const router = express.Router();

router.get(
  "/user",
  authCheck, // ตรวจสอบ token,login
  roleCheck(["ADMIN", "SUPERVISOR"]), // ตรวจสอบบทบาทที่อนุญาต(ระบุว่าบทบาทไหนบ้างที่มีสิทธิ์เข้าถึง)
  listUser // Controller ที่จัดการข้อมูล
);

module.exports = router;
