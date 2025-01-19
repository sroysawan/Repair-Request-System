const express = require('express')
const router = express.Router()
const { create, listPosition, updatePosition, deletePosition } = require('../controllers/position')
const { authCheck, roleCheck } = require('../middleware/authCheck')

router.post('/position',authCheck,roleCheck(['ADMIN']),create)
router.get('/position',authCheck,roleCheck(['ADMIN','SUPERVISOR']),listPosition)

router.put('/position/:id',authCheck,roleCheck(['ADMIN']),updatePosition)
router.delete('/position/:id',authCheck,roleCheck(['ADMIN']),deletePosition)

module.exports = router