const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { firstBlogs, blogsInDb, brokenBlog, newPost, usersInDb } = require('./test_helper')


beforeAll(async () => {
  await Blog.remove({})

  const blogObjects = firstBlogs.map(b => new Blog(b))
  await Promise.all(blogObjects.map(b => b.save()))
})

describe('tests for /api/blogs get', () => {
  test('blogs are returned as json', async () => {
    const dbBlogs = await blogsInDb() 

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

      expect(response.body.length).toBe(dbBlogs.length)
  })

  test('single blog post is returned as json', async () => {
    const dbBlogs = await blogsInDb() 
    const blog = dbBlogs[0]
    const response = await api
      .get(`/api/blogs/${blog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.title).toBe(blog.title)
  })

  test('blog post from database should have the same name', async () => {
    const dbBlogs = await blogsInDb()
    expect(dbBlogs[0].title).toBe('React patterns')
  })

  test('blog post with malformatted id should return 400', async () => {
    const response = await api
      .get(`/api/blogs/${brokenBlog.id}`)
      .expect(400)
  })

  test('blog post with malformatted id should return 400', async () => {
    brokenId = "asdf"
    const response = await api
      .get(`/api/blogs/${brokenId}`)
      .expect(400)
  })
})

describe.skip('test for /api/blogs post', () => {
  test('posted blogs can be found from database', async () => {
    const blogsBefore = await blogsInDb()

    await api
      .post('/api/blogs')
      .send(newPost)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await blogsInDb()
    const blogTitles = response.map(r => r.title)

    expect(response.length).toBe(blogsBefore.length+1)
    expect(blogTitles).toContain('Amazing new article - watch pictures')
  })

  test('blog without likes field should return 0 likes', async () => {
    const blogsBefore = await blogsInDb()

    const blog = {
      title: "What went wrong?",
      author: "Mikko Mallikas",
      url: "http://www.google.com"
    }

    await api 
      .post('/api/blogs')
      .send(blog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await blogsInDb()
    const likes = response.map(r => r.likes)
    expect(likes[blogsBefore.length]).toBe(0)
  })

  test('post without url should not be saved', async () => {
    const blogsBefore = await blogsInDb()
    const failBlog = {
      title: "Where is the author?",
      author: "Mikko mallikas",
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(failBlog)
      .expect(400)
    
    const blogsAfter = await blogsInDb()
    expect(blogsAfter.length).toBe(blogsBefore.length)
  })

  test('post without title should not be saved', async () => {
    const blogsBefore = await blogsInDb()
    const failBlog = {
      url: "http://www.google.com",
      author: "Mikko mallikas",
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(failBlog)
      .expect(400)
    
    const blogsAfter = await blogsInDb()
    expect(blogsAfter.length).toBe(blogsBefore.length)
  })
})

describe('tests for api/blogs deletion', () => {
  let addedBlog
  //save one post for deletion
  beforeAll(async () => {
    addedBlog = new Blog({
      title: 'Echoes',
      author: 'NM',
      url: 'http://',
      likes: 2
    })

    await addedBlog.save()
  })

  test('blog with valid id can be deleted', async () => {
    const dbBlogs = await blogsInDb() 
    const deleteBlog = dbBlogs[dbBlogs.length-1]

    await api
      .delete(`/api/blogs/${deleteBlog.id}`)
      .expect(204)

    const blogsAfter = await blogsInDb() 
    const titles = blogsAfter.map(b => b.title)

    expect(blogsAfter.length).toBe(dbBlogs.length-1)
    expect(titles).not.toContain(addedBlog.title)
  })

  test('blog without valid id will not delete anything', async () => {
    const dbBlogs = await blogsInDb()
    const badId = "asdf"

    const response = await api
      .delete(`/api/blogs/${badId}`)
      .expect(400)

    const blogsAfter = await blogsInDb()
    
    expect(blogsAfter.length).toBe(dbBlogs.length)
  })
})

describe('tests for api/users post', () => {
  beforeAll(async () => {
    await User.remove({})
    const user = new User({ 
      username: 'root', 
      name:'Super Kayttaja', 
      password: 'salaisuus', 
      adult: true 
    })  
    await user.save()
  })
  test('posting to /api/user succeeds with a new username', async () => {
    const usersBefore = await usersInDb()
    const newuser = ({ 
      username: 'jani', 
      name: "J A",
      password: 'toni', 
      adult: false 
    })
    
    await api 
      .post('/api/users')
      .send(newuser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await usersInDb()
    
    expect(usersAfter.length).toBe(usersBefore.length+1)
    expect(usersAfter[usersBefore.length].name).toBe(newuser.name)
    expect(usersAfter[usersBefore.length].adult).toBe(false)
  })
  test('posting to /api/user fails with too short password', async () => {
    const usersBefore = await usersInDb()

    const failUser = ({ username: 'mouk', name: "Mikko Mallikas", password: 't', adult: true})

    const result = await api
      .post('/api/users')
      .send(failUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual({ error: 'Password is too short' })

    const usersAfter = await usersInDb()
    expect(usersAfter.length).toBe(usersBefore.length)
  }) 

  test('creating a non-unique username fails', async () => {
    const usersBefore = await usersInDb()
    const user = usersBefore[0].username
    const failUser = ({ username: user, name: "Jani Kuokka", password: 'secretagent', adult: true})
    
    const result = await api
      .post('/api/users')
      .send(failUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual({ error: 'Username already taken' })
    const usersAfter = await usersInDb()
    expect(usersAfter.length).toBe(usersBefore.length)
  })

  test('user without adult-parameter should return true', async () => {
    const usersBefore = await usersInDb()
    const newuser = ({ username: 'makkara', name: "MM", password: 'sininenlenkki' })
    
    await api 
      .post('/api/users')
      .send(newuser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await usersInDb()
    expect(usersAfter[usersBefore.length].adult).toBe(true)
  }) 
})

afterAll(() => {
  server.close()
})