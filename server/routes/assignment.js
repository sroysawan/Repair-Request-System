const express = require("express");
const { assignRepairJob, assignJobByTechnician, listAssignment, listAssignmentByTechnician, readAssignment } = require("../controllers/assignment");
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
module.exports = router;
