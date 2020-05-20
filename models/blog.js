const mongoose = require('mongoose')
const config = require('../utils/config')
const logger = require('../utils/logger')

const url = config.MONGODB_URI;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })


const blogSchema = new mongoose.Schema({
    title: {type: String, required: true, minlength: 2},
    author: {type: String, required: true, minlength: 2},
    url:  {type: String, required: true, minlength: 10},
    likes: Number
  })


blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
  module.exports = mongoose.model('Blog', blogSchema)