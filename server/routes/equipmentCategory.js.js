const express = require('express');
const { create, listCategory, updatedCategory, deleteCategory, readCategory } = require('../controllers/equipmentCategory');
const { authCheck, roleCheck } = require('../middleware/authCheck');
const router = express.Router()

router.post('/category',authCheck,roleCheck(['ADMIN']),create)

router.get('/category/:id',authCheck,readCategory)
router.get('/category',authCheck,listCategory)
router.patch('/category/:id',authCheck,roleCheck(['ADMIN']),updatedCategory)
router.delete('/category/:id',authCheck,roleCheck(['ADMIN']),deleteCategory)

module.exports = router