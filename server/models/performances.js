const mongoose = require('mongoose')

const performanceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minLength: 5,
            maxLength: 255
        },
        year: {
            type: Number,
            required: true,
            min: 2020,
            max: 2025
        },
        budget: {
            type: Number,
            required: true,
            min: 0,
        },
        actors: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Actor'
        }]
    }, { timestamps: true, versionKey: false }
)

module.exports = mongoose.model('Performance', performanceSchema)
