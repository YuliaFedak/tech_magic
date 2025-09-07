require('dotenv').config()
const User = require('../models/users')
const bcrypt = require('bcrypt')

async function checkSuperuserExists() {
    const findSuperuser = await User.findOne({ role: 'admin'})

    if (!findSuperuser) {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 8)

        await User.create({
            username: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            hashedPassword,
            role: 'admin'
        })
        // console.log('Create superuser')
    }

    // console.log(`Find superuser ${findSuperuser.username}`)
}

module.exports = { checkSuperuserExists }
