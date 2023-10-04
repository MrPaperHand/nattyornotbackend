const mongoose = require('mongoose')
// require('dotenv').config()

// const mongoUrl = process.env.MONGODB_URI

// mongoose.connect(mongoUrl)

const postSchema = new mongoose.Schema({
    title: String,
    author: String,
    likes: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    filekey: String,
    file: String
  })

  // const postSchema = new mongoose.Schema({
  //   title: String,
  //   author: String,
  //   url: String,
  //   likes: Number,
  //   user: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'User'
  //   },
  //   filekey: String,
  //   file: String
  // })

  postSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id;
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  });

module.exports = mongoose.model('Post', postSchema)