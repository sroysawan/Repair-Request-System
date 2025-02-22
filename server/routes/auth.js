const express = require('express')
const router = express.Router()

const { register, login, currentUser } = require('../controllers/auth')
const { authCheck, roleCheck } = require('../middleware/authCheck')

router.post('/register',authCheck,roleCheck(['ADMIN', 'SUPERVISOR']),register)

router.post('/login',login)

router.get('/current-user',authCheck,currentUser)

module.exports = router