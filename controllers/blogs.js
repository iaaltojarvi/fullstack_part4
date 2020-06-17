const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', (request, response, next) => {
  let blog = new Blog(request.body)
  if (!blog.likes) {
    blog.likes = 0
  }
  if (!blog.title || !blog.url) {
    return response.status(400).json({
      error: 'Bad request'
    })
  }
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id, { useFindAndModify: false })
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  try {
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, useFindAndModify: false })
    response.json(updatedBlog.toJSON())
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter