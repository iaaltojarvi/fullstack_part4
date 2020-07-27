const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')



describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })


  test('creation fails with proper statuscode and message if username already taken', async () => {
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'eikerrota',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    expect(result.body.error).toContain('Please provide unique username')

    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(1)
  })

  test('creation succeeds with a fresh username', async () => {
    let usersAtStart = await api.get('/api/users')
    usersAtStartLength = usersAtStart.body.length

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const usersAtEnd = await api.get('/api/users')
    expect(usersAtEnd.body).toHaveLength(usersAtStartLength + 1)

    const usernames = usersAtEnd.body.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('user is not created if username is under three characters', async () => {
    let usersAtStart = await api.get('/api/users')
    usersAtStartLength = usersAtStart.body.length

    const newUser = {
      username: 'm',
      name: 'Mirja',
      password: 'salaisuus',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400, /Please provide unique username/ig)

    const usersAtEnd = await api.get('/api/users')
    expect(usersAtEnd.body).toHaveLength(usersAtStartLength)

  })

  test('user is not created if password is not provided', async () => {
    let usersAtStart = await api.get('/api/users')
    usersAtStartLength = usersAtStart.body.length

    const newUser = {
      username: 'mirjamimi',
      name: 'Mirja'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400, /Password is required/ig)

    const usersAtEnd = await api.get('/api/users')
    expect(usersAtEnd.body).toHaveLength(usersAtStartLength)

  })
})

afterAll(async () => {
  await mongoose.connection.close();
})
