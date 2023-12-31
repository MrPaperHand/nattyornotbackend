const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('posts', {url:1, title: 1, author: 1, id: 1})
    response.json(users)
  })

module.exports = usersRouter