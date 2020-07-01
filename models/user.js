const mongoose = require('mongoose')
const config = require('../utils/config')
const logger = require('../utils/logger')
const uniqueValidator = require('mongoose-unique-validator')

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