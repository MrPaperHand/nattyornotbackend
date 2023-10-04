const jwt = require('jsonwebtoken')
const multer = require('multer')
const postsRouter = require('express').Router()
const mongoose = require('mongoose')
const Post = require('../models/post')
const User = require('../models/user')
const { s3Upload, s3GetImage} = require('../s3service')
require('dotenv').config()

const mongoUrl = process.env.MONGODB_URI

mongoose.connect(mongoUrl)

const storage = multer.memoryStorage()

const upload = multer({
  storage
})

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if(authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
    }
    return null
}

  // ok so here is where the posts get got. But how would i get mongodb to show the image? Well first I geuss
  // I have to store the image url on the post call.
  postsRouter.get('/', async (request, response) => {
      const posts = await Post.find({}).populate('user', {username:1, name: 1})
      response.json(posts)
      })

  postsRouter.post('/', upload.single('file'), async (request, response) => {
    const bodyContent = request.body
    const file = request.file
    const s3ObjectKey = await s3Upload(file) 

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if(!decodedToken.id) {
      return response.status(401).json({error: 'token invalid'})
    }

    const user = await User.findById(decodedToken.id)

    const post = new Post({
      title: bodyContent.title,
      author: bodyContent.author,
      likes: bodyContent.likes,
      user: bodyContent.user,
      filekey: `https://nattyornot.s3.us-west-1.amazonaws.com/${s3ObjectKey}`
    })

      const savedPost = await post.save()
      user.posts = user.posts.concat(savedPost._id)
      await user.save()
      response.status(201).json(savedPost)
  })

  postsRouter.delete('/:id', async (request,response) => {
    await Post.findByIdAndRemove(request.params.id)
    response.status(204).end()
  })

  postsRouter.put('/:id', async (request,response) => {
    const body = request.body

    const post = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }

    await Post.findByIdAndUpdate(request.params.id, post, {new: true})
    response.status(204).end()
  })

module.exports = postsRouter