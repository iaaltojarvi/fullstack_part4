require('dotenv').config()
const http = require('http')
const express = require('express')
const cors = require('cors')
const app = express()
const Blog = require('./models/blog')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
    res.send('<h1>Blog</h1>')
  })
app.get('/api/blogs', (request, response) => {
  Blog.find({}).then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})