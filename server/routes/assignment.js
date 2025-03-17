const express = require("express");
const { assignRepairJob, assignJobByTechnician, listAssignment, listAssignmentByTechnician, readAssignment, listAssignableStatuses, changeTechnicianAssignment } = require("../controllers/assignment");
const { authCheck, roleCheck } = require("../middleware/authCheck");
const router = express.Router();

// Route: Assign งานโดยแอดมิน
router.post("/assign-by-supervisor",authCheck,roleCheck(["ADMIN", "SUPERVISOR"]), assignRepairJob);

// Route: Assign งานโดยตัวช่างเอง
router.post(
    "/assign-by-technician",authCheck,roleCheck(["SUPERVISOR","TECHNICIAN"]),assignJobByTechnician
  );

  router.get('/assignments',listAssignment)
  router.get('/assignment/:id',readAssignment)
  router.get('/assignments/by-technician',authCheck,listAssignmentByTechnician)

router.get('/status-assignments',authCheck,listAssignableStatuses)
router.patch('/assignments/change-technician',authCheck,roleCheck(["ADMIN", "SUPERVISOR"]),changeTechnicianAssignment)

module.exports = router;
