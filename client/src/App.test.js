import React from 'react'
import { shallow, mount } from 'enzyme'
jest.mock('./services/blogs')
import App from './App'
import Blog from './components/Blog'
import blogService from './services/blogs'

describe('<App />', () => {
  let app
  const user = {
    username: 'tester',
    token: '1231231214',
    name: 'Teuvo Testaaja'
  }

  describe('when user is not logged', () => {
    beforeEach(() => {
      // luo sovellus siten, että käyttäjä ei ole kirjautuneena
      app = mount(<App />)
      app.setState({ user: null })
      //remove item from local storage
      localStorage.setItem('loggedBlogAppUser', JSON.stringify(null))
    })

    it('only login form is rendered', () => {
      app.update()
      const blogComponents = app.find(Blog)
      
      let html = app.html()
      expect(html).toContain('Login to application')
      //check that no blogs are found
      expect(html).not.toContain('by')
    })
  })

  describe('when user is logged', () => {
    beforeEach(() => {
      // luo sovellus siten, että käyttäjä on kirjautuneena
      app.setState({ user: user })
      localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
    })

    it('blogs are rendered', () => {
      app.update()
      let html = app.html()
      //console.log(app.html())
      expect(html).not.toContain('Login to application')
      //see that the app has the same amount of blogs as the backend:
      const blogComponents = app.find(Blog)
      expect(blogComponents.length).toEqual(blogService.blogs.length)
    })
  })
})