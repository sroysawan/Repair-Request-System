const express = require('express');
const { completeAssignment, listRepairHistory, listRepairHistoryByTechnician, completeAssignmentBySupervisor, readRepairHistory } = require('../controllers/repairHistory');
const { authCheck } = require('../middleware/authCheck');
const router = express.Router();

router.put('/complete-assignment',authCheck, completeAssignment);
router.put('/complete-assignment/by-supervisor',authCheck, completeAssignmentBySupervisor);
router.get('/repair-history',authCheck, listRepairHistory);

router.get('/repair-history/by-technician',authCheck,listRepairHistoryByTechnician)
router.get('/repair-history/:id',authCheck,readRepairHistory)

module.exports = router