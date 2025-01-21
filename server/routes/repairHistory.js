const express = require('express');
const { completeAssignment } = require('../controllers/repairHistory');
const { authCheck } = require('../middleware/authCheck');
const router = express.Router();

router.put('/complete-assignment',authCheck, completeAssignment);


module.exports = router