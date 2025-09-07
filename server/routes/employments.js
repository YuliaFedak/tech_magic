const express = require('express')
const router = express.Router()
const { createContract, getAllContacts, getOneContract, updateContract, deleteContract, getAllActorContracts } = require('../controller/employments')
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware')

router.post('/', authMiddleware, roleMiddleware('admin'), createContract)
router.get('/', authMiddleware, getAllContacts)
router.get('/:id', authMiddleware, getOneContract)
router.patch('/:id', authMiddleware, roleMiddleware('admin'), updateContract)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteContract)

router.get('/actor/:actorId', authMiddleware, getAllActorContracts)
module.exports = router
