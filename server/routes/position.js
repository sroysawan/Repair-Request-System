const express = require('express')
const router = express.Router()
const { create, listPosition, updatePosition, deletePosition, readPosition } = require('../controllers/position')
const { authCheck, roleCheck } = require('../middleware/authCheck')

router.post('/position',authCheck,roleCheck(['ADMIN']),create)
router.get('/position',authCheck,listPosition)


router.get('/position/:id',authCheck,readPosition)
router.patch('/position/:id',authCheck,roleCheck(['ADMIN']),updatePosition)
router.delete('/position/:id',authCheck,roleCheck(['ADMIN']),deletePosition)

module.exports = router