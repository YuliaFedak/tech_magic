const User = require('../models/users')
const Actor = require('../models/actors')
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')

async function signup (req, res) {
    try {
        const { username, email, password, actor } = req.body
        const hashedPassword = await bcrypt.hash(password, 8)

        const existUser = await User.findOne({email})

        if (existUser) {
            return res.json({ message: "This user already exists"})
        }

        const createActor = await Actor.create(actor)
        const createUser = await User.create({ username, email, hashedPassword, actorId: createActor._id})

        return res.json(createUser)
    } catch (e) {
        res.json({ error: e.message})
    }
}

async function login(req, res) {
    try {
        const {email, password} = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found"})
        }

        const validPassword = await bcrypt.compare(password, user.hashedPassword)
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password"})
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: '3h'}
        )
        return res.json({ token })

    } catch (e) {
        res.json({ error: e.message})
    }
}

async function getActorId(req, res) {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        res.json({ actorId: user.actorId})
    } catch (e) {
        res.json({ error: e.message})
    }
}


module.exports = {
    signup,
    login,
    getActorId
}
