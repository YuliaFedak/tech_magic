const express = require('express')
const router = express.Router()
const {getAllActors, getOneActorById, updateActor, deleteActor } = require('../controller/actors')
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware')

// router.post('/', createActor)
router.get('/',authMiddleware,roleMiddleware('admin'),  getAllActors)
router.get('/:id',authMiddleware, getOneActorById)
router.patch('/:id', authMiddleware, updateActor)
router.delete('/:id',authMiddleware, deleteActor)




module.exports = router
