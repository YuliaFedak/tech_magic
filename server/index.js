require('dotenv').config()
const express = require('express')
const connectDB = require('./db/db')
const cors = require('cors')
const app = express()

const port = 3000

connectDB()

const authRouter = require('./routes/auth')
const actorRouter = require('./routes/actors')
const performanceRouter = require('./routes/performances')
const employmentRouter = require('./routes/employments')

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}))
app.use(express.json())
app.use('/auth', authRouter)
app.use('/actors', actorRouter)
app.use('/performances', performanceRouter)
app.use('/contracts', employmentRouter)

app.listen(port, () => {
    console.log(`Server listening on ${port}...`)
})
