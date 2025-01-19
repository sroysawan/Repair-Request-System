const express = require('express');
const { authCheck, roleCheck } = require('../middleware/authCheck');
const { listRoles } = require('../controllers/role');
const router = express.Router()

router.get('/roles', authCheck, roleCheck(['ADMIN', 'SUPERVISOR']), listRoles);



module.exports = router