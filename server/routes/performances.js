const express = require('express')
const router = express.Router()
const { createPerformance, getAllPerformanceByYear, getAllPerformanceName, updatePerformance, deletePerformance } = require('../controller/performances')
const {authMiddleware, roleMiddleware} = require("../middleware/authMiddleware");

router.post('/', authMiddleware, roleMiddleware('admin'), createPerformance)
router.get('/',authMiddleware, getAllPerformanceByYear)
router.get('/names', authMiddleware, getAllPerformanceName)
router.patch('/:id',  authMiddleware, roleMiddleware('admin'), updatePerformance)
router.delete('/:id',  authMiddleware, roleMiddleware('admin'), deletePerformance)

module.exports = router
