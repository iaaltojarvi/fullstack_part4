const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const initialUser = 
        {
            username: 'I am testing',
            name: 'Minä',
            passwordHash
        }
    let userObject = new User(initialUser)
    await userObject.save()
})

test('creation fails with proper statuscode and message if username already taken', async () => {
    let usersAtStart = await api.get('/api/users')
    usersAtStartLength = usersAtStart.body.length

    const newUser = {
      username: 'I am testing',
      name: 'Superuser',
      password: 'ei kerrota',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)

    expect(result.body).toContain('User validation failed')
    console.log(result)

    const usersAtEnd = await api.get('/api/users')
    expect(usersAtEnd.body).toHaveLength(usersAtStartLength)
  })



// test('creation succeeds with a fresh username', async () => {
//     let usersAtStart = await api.get('/api/users')
//     usersAtStartLength = usersAtStart.body.length

//     const newUser = {
//         username: 'mluukkai',
//         name: 'Matti Luukkainen',
//         password: 'salainen',
//     }

//     await api
//         .post('/api/users')
//         .send(newUser)
//         .expect(200)

//     const usersAtEnd = await api.get('/api/users')
//     expect(usersAtEnd.body).toHaveLength(usersAtStartLength + 1)

//     const usernames = usersAtEnd.body.map(u => u.username)
//     expect(usernames).toContain(newUser.username)
// })


