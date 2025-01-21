const express = require("express");
const { listUser, updateUser, readUser, changeStatusUser, changeRole, changePassword } = require("../controllers/user");
const { authCheck, roleCheck, checkUserExists } = require("../middleware/authCheck");
const router = express.Router();

router.get(
  "/user",
  authCheck, // ตรวจสอบ token,login
  roleCheck(["ADMIN", "SUPERVISOR"]), // ตรวจสอบบทบาทที่อนุญาต(ระบุว่าบทบาทไหนบ้างที่มีสิทธิ์เข้าถึง)
  listUser // Controller ที่จัดการข้อมูล
);

router.get('/user/:id',authCheck,roleCheck(["ADMIN", "SUPERVISOR"]),readUser)
router.put('/user/:id',authCheck,roleCheck(["ADMIN", "SUPERVISOR"]),checkUserExists,updateUser)

// delete

router.patch('/user/change-status',authCheck,roleCheck(["ADMIN", "SUPERVISOR"]),checkUserExists,changeStatusUser)
router.patch('/user/change-role',authCheck,roleCheck(["ADMIN", "SUPERVISOR"]),checkUserExists,changeRole)
router.patch('/user/change-password/:id'
  ,authCheck // ตรวจสอบ token ว่าใช้งานได้และผู้ใช้ล็อกอินหรือยัง
  ,roleCheck(["ADMIN", "SUPERVISOR"]) // ตรวจสอบสิทธิ์ผู้ใช้ว่าเป็น ADMIN หรือ SUPERVISOR
,checkUserExists // ตรวจสอบว่าผู้ใช้ (id) ที่จะเปลี่ยนรหัสผ่านมีอยู่จริงในฐานข้อมูล
,changePassword)  // ดำเนินการเปลี่ยนรหัสผ่าน




module.exports = router;
