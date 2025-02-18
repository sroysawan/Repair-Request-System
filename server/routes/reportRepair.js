const express = require('express')
const { authCheck, roleCheck } = require('../middleware/authCheck')
const { create, listReportRepair, readReportRepair, listReportRepairByUser, listReportRepairByTechnician, listReportRepairNews } = require('../controllers/reportRepair')
const router = express.Router()

router.post('/report-repair',authCheck,create)

//ประวัติการแจ้งซ่อมทั้งหมด
router.get('/report-repair/history/all',authCheck,listReportRepair)


//ประวัติการแจ้งซ่อม by id
router.get('/report-repair/history/by-id/:id',authCheck,readReportRepair)

//ประวัติการแจ้งซ่อมทั้งหมดของ User
router.get('/report-repair/history/by-user',authCheck,listReportRepairByUser)


//supervisor technician
router.get('/report-repair/news',authCheck,roleCheck(['ADMIN','SUPERVISOR','TECHNICIAN']),listReportRepairNews)









module.exports = router