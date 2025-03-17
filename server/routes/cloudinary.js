const express = require('express')
const router = express.Router()

const { authCheck, roleCheck } = require('../middleware/authCheck')
const { createImages, removeImage } = require('../controllers/cloudinary')

router.post('/images', authCheck,createImages )
router.post('/removeimages', authCheck,removeImage )


module.exports = router
