require('dotenv').config()
const { mongoose } = require('mongoose')
const { checkSuperuserExists } = require('./createSuperUser')

const url = process.env.DB_URL


async function connectDB() {
    try {
        await mongoose.connect(`${url}`)
        console.log("Mongoose connected")
        await checkSuperuserExists()
    } catch (e) {
        console.error("Mongoose disconnected", e.message)
        process.emit(1)
    }
}

module.exports = connectDB
