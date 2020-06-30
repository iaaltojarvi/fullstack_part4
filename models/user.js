const mongoose = require('mongoose')
const config = require('../utils/config')
const logger = require('../utils/logger')
const uniqueValidator = require('mongoose-unique-validator')

const url = config.MONGODB_URI;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

const userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true, minlength: 3},
  name: String,
  passwordHash: {type: String, required: true, minlength: 3},
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

const User = mongoose.model('User', userSchema)

module.exports = User