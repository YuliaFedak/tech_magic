const mongoose = require('mongoose')

const employmentScheme = new mongoose.Schema({
    actor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor',
        required: true
    },
    performance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Performance",
        required: true,
    },
    role: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    salary: {
        type: Number,
        required: true,
        min: 0,
    }
}, { timestamps: true, versionKey: false }
)

module.exports = mongoose.model('Employment', employmentScheme)
