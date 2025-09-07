const mongoose = require('mongoose')

const actorSchema = new mongoose.Schema(
    {
        last_name: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 50
        },
        first_name: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 50
        },
        middle_name: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 50
        },
        rank: {
            type: String,
            required: false,
            minLength: 3,
            maxLength: 50
        },
        experience: {
            type: Number,
            required: false,
            min: 0,
            max: 100
        }
    }, { timestamps: true, versionKey: false }
)

module.exports = mongoose.model('Actor', actorSchema)
