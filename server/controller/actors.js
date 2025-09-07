const Actor = require('../models/actors')

function notFound (item, itemName) {
    if (!item) {
        const error = new Error(`${itemName} not found`);
        error.status = 404
        throw error
    }
}

async function getAllActors (req, res) {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit
        const actors = await Actor.find({}).skip(skip).limit(limit)

        const total = await Actor.countDocuments()
        const totalPage = Math.ceil( total / limit)
        res.json({ page, limit, total, totalPage, actors})
    } catch (e) {
        res.json({error: e.message})
    }
}

async function getOneActorById (req, res) {
    try {
        const { id } = req.params;
        const actor = await Actor.findById(id)
        notFound(actor, 'Actor')
        res.json(actor)
    } catch (e) {
        res.json({error: e.message})
    }
}

async function updateActor (req, res) {
    try {
        const { id } = req.params
        const updateActor = req.body
        const actor = await Actor.findByIdAndUpdate(id, updateActor, { new: true, runValidators: true })
        notFound(actor, 'Actor')
        res.json(actor)
    } catch (e) {
        res.json({error: e.message})
    }
}

async function deleteActor (req, res) {
    try {
        const { id } = req.params
        const actor = await Actor.findByIdAndDelete(id)
        notFound(actor, 'Actor')
        res.json({message: `Actor ${id} deleted`})
    } catch (e) {
        res.json({error: e.message})
    }

}

module.exports = {
    getAllActors,
    getOneActorById,
    updateActor,
    deleteActor,
    notFound
}
