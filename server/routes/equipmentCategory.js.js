const express = require('express');
const { create, listCategory, updatedCategory, deleteCategory } = require('../controllers/equipmentCategory');
const { authCheck, roleCheck } = require('../middleware/authCheck');
const router = express.Router()

router.post('/category',authCheck,roleCheck(['ADMIN']),create)
router.get('/category',authCheck,listCategory)

router.put('/category/:id',authCheck,roleCheck(['ADMIN']),updatedCategory)
router.delete('/category/:id',authCheck,roleCheck(['ADMIN']),deleteCategory)

module.exports = router