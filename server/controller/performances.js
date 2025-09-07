const Performance = require('../models/performances')

const { notFound } = require('../controller/actors')

async function createPerformance(req, res) {
    try {
        const performance = await Performance.create(req.body)
        return res.json(performance)
    } catch (e) {
        return res.json({error: e.message})
    }
}

async function getAllPerformanceByYear(req, res) {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit
        const year = parseInt(req.query.year)
        const performancesCountByYear = await Performance.find({ year: year})
        const performances = await Performance.find({ year: year}).populate('actors').skip(skip).limit(limit)

        const total = performancesCountByYear.length
        const totalPage = Math.ceil(total / limit)
        res.json({page, limit, total, totalPage, performances})
    } catch (e) {
        res.json({error: e.message})
    }
}

async function getAllPerformanceName(req, res) {
    try {
        const performances = await Performance.find({})
        notFound(performance, 'Performance')
        res.json(performances);
    } catch (e) {
        res.json({error: e.message})
    }
}

async function updatePerformance(req, res) {
    try {
        const { id } = req.params
        const updatePer = req.body
        const performance = await Performance.findByIdAndUpdate(id, updatePer, { new: true, runValidators: true }).populate('actors')
        notFound(performance, 'Performance')
        res.json(performance)
    } catch (e) {
        res.json({error: e.message})
    }
}

async function deletePerformance(req, res) {
    try {
        const { id } = req.params
        const performance = await Performance.findByIdAndDelete(id)
        notFound(performance, 'Performance')
        res.json("Performance deleted")
    } catch (e) {
        res.json({error: e.message})
    }
}

module.exports = {
    createPerformance,
    getAllPerformanceByYear,
    getAllPerformanceName,
    updatePerformance,
    deletePerformance
}
