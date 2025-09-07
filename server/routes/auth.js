const express = require('express')
const router = express.Router()
const { signup, login, getActorId } = require('../controller/auth')
const { authMiddleware} = require('../middleware/authMiddleware')

router.post('/signup', signup)
router.post('/login', login)
router.get('/me/:id',authMiddleware, getActorId)
module.exports = router
