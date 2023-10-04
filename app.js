const loginRouter = require('./controllers/login')
const postsRouter = require('./controllers/posts')
const registerRouter = require('./controllers/register')
const usersRouter = require('./controllers/users')
const express = require('express')
const mongoose = require('mongoose')
// const Grid = require('gridfs-stream')
const app = express()
const cors = require('cors')
require('dotenv').config();

app.use(cors())
app.use(express.json())
app.use('/api/login', loginRouter)
app.use('/api/posts', postsRouter)
app.use('/api/register', registerRouter)
app.use('/api/users', usersRouter)

module.exports = app