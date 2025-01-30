const express = require('express');
const { create, listEquipment, getEquipmentByCategory, updateEquipment, readEquipment, statusEquipment,   } = require('../controllers/equipment');
const { authCheck, roleCheck } = require('../middleware/authCheck');
const router = express.Router()

//อุปกรณ์สำนักงาน
router.post('/equipment',authCheck,roleCheck(['ADMIN']),create)

router.get('/equipment',authCheck,listEquipment)

router.get('/equipment/:id',authCheck,readEquipment)
router.get('/equipment/category/:id',authCheck,getEquipmentByCategory)

router.put('/equipment/:id',authCheck,roleCheck(['ADMIN']),updateEquipment)

router.get('/status-equipment',authCheck,statusEquipment)

module.exports = router