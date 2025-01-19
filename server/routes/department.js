const express = require('express')
const { create, listDepartment, updateDepartment, deleteDepartment } = require('../controllers/department')
const { authCheck, roleCheck } = require('../middleware/authCheck')
const router = express.Router()

router.post('/department',authCheck,roleCheck(['ADMIN']),create)
router.get('/department',authCheck,roleCheck(['ADMIN','SUPERVISOR']),listDepartment)
router.put('/department/:id',authCheck,roleCheck(['ADMIN']),updateDepartment)
router.delete('/department/:id',authCheck,roleCheck(['ADMIN']),deleteDepartment)
module.exports = router