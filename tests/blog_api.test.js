const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const blog = require('../models/blog')

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
  await User.deleteMany({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

describe('When there are two blogs in db', () => {

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
    const passwordHash = await bcrypt.hash('sekret', 10)
    let user = new User({ username: 'Blogs', passwordHash })
    await user.save()
  
    const newPost = {
      title: 'I try to test if this is ok',
      author: 'Me',
      url: 'www.test.fi',
      likes: 0,
      user: user._id
    }
    await api
      .post('/api/blogs')
      .send(newPost)
      .expect(200)

    const response = await api.get('/api/blogs')

    const title = response.body.map(r => r.title)

    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(title).toContain(
      'I try to test if this is ok'
    )
  })

  test('likes is 0 if no value', async () => {
    const passwordHash = await bcrypt.hash('sekret', 10)
    let user = new User({ username: 'Blogs user', passwordHash })
    await user.save()
    const newPost = {
      title: 'New post with no likes',
      author: 'Me',
      url: 'www.test.fi',
      user: user._id
    }
    await api
      .post('/api/blogs')
      .send(newPost)
      .expect(200)
    const response = await api.get('/api/blogs')
    let likes = response.body.map(r => r.likes)
    like = likes[initialBlogs.length]
    expect(like).toBe(0)
  })

  test('return bad request error if no title or url in post', async () => {
    const newPost = {
      author: 'Test user',
      likes: 10
    }
    await api
      .post('/api/blogs')
      .send(newPost)
      .expect(400, /Bad request/ig)
  })
})

afterAll(async () => {
  await mongoose.connection.close();
})