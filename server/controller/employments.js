const { notFound } = require('../controller/actors')
const Contract = require('../models/employments')


async function createContract(req, res) {
    try {
        const contract = await Contract.create(req.body)
        res.json(contract)
    } catch (e) {
        res.json({error: e.message})
    }
}

async function getAllContacts(req, res) {
    try {
        const contracts = await Contract.find({}).populate('performance')
        res.json(contracts)
    } catch (e) {
        res.json({error: e.message})
    }
}

async function getOneContract(req, res) {
    try {
        const { id } = req.params
        const contracts = await Contract.findById(id).populate('performance')
        notFound(contracts, 'Contract')
        res.json(contracts)
    } catch (e) {
        res.json({error: e.message})
    }
}

async function getAllActorContracts(req, res) {
    try {
        const { actorId } = req.params
        const contracts = await Contract.find({
            actor: actorId
        }).populate('performance')
        if (!contracts || contracts.length === 0) {
            notFound(contracts, 'Contract')
        }

        res.json(contracts);
    } catch (e) {
        res.json({error: e.message})
    }
}

async function updateContract(req, res) {
    try {
        const { id } = req.params
        const contract = await Contract.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).populate('performance')
        notFound(contract, 'Contract')
        res.json(contract)
    } catch (e) {
        res.json({error: e.message})
    }
}

async function deleteContract(req, res) {
    try {
        const { id } = req.params
        const contract = await Contract.findByIdAndDelete(id)
        notFound(contract, 'Contract')
        res.json("Contract deleted")
    } catch (e) {
        res.json({error: e.message})
    }
}

module.exports = {
    createContract,
    getAllContacts,
    getOneContract,
    updateContract,
    deleteContract,
    getAllActorContracts
}
