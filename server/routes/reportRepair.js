const express = require('express')
const { authCheck } = require('../middleware/authCheck')
const { create, listReportRepair, readReportRepair, listReportRepairByUser, listReportRepairByTechnician } = require('../controllers/reportRepair')
const router = express.Router()

router.post('/report-repair',authCheck,create)

//ประวัติการแจ้งซ่อมทั้งหมด
router.get('/report-repair/history/all',authCheck,listReportRepair)

//ประวัติการแจ้งซ่อม by id
router.get('/report-repair/history/by-id/:id',authCheck,readReportRepair)

//ประวัติการแจ้งซ่อมทั้งหมดของ User
router.get('/report-repair/history/by-user',authCheck,listReportRepairByUser)









module.exports = router