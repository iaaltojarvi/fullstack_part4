const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog.toJSON())
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  let body = request.body

  const user = await User.findById(body.userId)

  const blog = new Blog({
   title: body.title,
   author: body.author,
   url: body.url,
   likes: body.likes,
   user: user._id
  })

  if (!blog.likes) {
    blog.likes = 0
  }
  if (!blog.title || !blog.url) {
    return response.status(400).json({
      error: 'Bad request'
    })
  }
  try {
    const result = await blog.save()
    response.status(201).json(result)
    user.result = user.result.concat(result._id)
    await user.save()
  } catch (error) {
    next(error)
  }
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