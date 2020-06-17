const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'I am testing',
    author: 'Tester',
    url: 'www.test.fi',
    likes: 2
  },
  {
    title: 'I am testing more',
    author: 'Tester again',
    url: 'www.test.fi',
    likes: 1
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  const response = await api.get('/api/blogs')
  expect(response.status).toBe(200)
  expect(response.type).toBe("application/json")
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('_id is converted to id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  expect(blog.id).toBeDefined();
})

test('post adds one blog', async () => {
  const newPost = {
    title: 'I try to test if this is ok',
    author: 'Me',
    url: 'www.test.fi',
    likes: 0
  }
  await api
    .post('/api/blogs')
    .send(newPost)
    .expect(201)

  const response = await api.get('/api/blogs')

  const title = response.body.map(r => r.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(title).toContain(
    'I try to test if this is ok'
  )
})

test('likes is 0 if no value', async () => {
  const newPost = {
    title: 'New post with no likes',
    author: 'Me',
    url: 'www.test.fi',
    likes: null
  }
  await api
    .post('/api/blogs')
    .send(newPost)
    .expect(201)
  const response = await api.get('/api/blogs')
  let likes = response.body.map(r => r.likes)
  like = likes[initialBlogs.length]
  expect(like).toBe(0)
})



// Tee testi joka varmistaa, että jos kentälle likes ei anneta arvoa, asetetaan sen arvoksi 0. Muiden kenttien sisällöstä ei tässä tehtävässä vielä välitetä.
// Laajenna ohjelmaa siten, että testi menee läpi.


afterAll(async () => {
  await mongoose.connection.close();
})