const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            minLength: 3,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        hashedPassword: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            emum: ['admin', 'actor'],
            default: 'actor'
        },
        actorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Actor",
            required: function () {
                return this.role === 'actor'
            }
        }
    } , { timestamps: true, versionKey: false }
)

module.exports = mongoose.model("User", userSchema)
