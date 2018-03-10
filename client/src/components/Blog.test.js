import React from 'react'
import { shallow, mount } from 'enzyme'
import Blog from './Blog'

describe('<Blog />', () => {
  let blogComponent
  //<Blog blog={blog} like={this.addLike} delete={this.deleteBlog} currentUser={this.state.user}/>
  const blog = {
      id: 1,
      title: 'titteli',
      author: 'kirjoittaja',
      url: 'http://www.fi',
      likes: 3,
      user: {username: 'joku', name: 'Joku Joukahainen'}
    }
  let currentUser = {username: 'joku' }

  beforeEach(() => {
    let mockHandler = jest.fn()
    blogComponent = mount ( <Blog blog={blog} currentUser={currentUser}/> )
  })


  it('should only show title and author before toggling', () => {
    //console.log(blogComponent.debug())
    const contentDiv = blogComponent.find('.blogContent')
    //
    expect(contentDiv.text()).toContain(blog.title)
    expect(contentDiv.text()).toContain(blog.author)
    expect(contentDiv.text()).not.toContain(blog.likes)
    expect(contentDiv.text()).not.toContain(blog.url)
  })

  it('should show all information after toggling', () => {
    const clickableDiv = blogComponent.find('.togglableContent')
    clickableDiv.simulate('click')

    const contentDiv = blogComponent.find('.blogContent')
    //console.log(blogComponent.debug())
    //console.log(contentDiv.debug())
    expect(contentDiv.text()).toContain(blog.title)
    expect(contentDiv.text()).toContain(blog.author)
    expect(contentDiv.text()).toContain(blog.likes)
    expect(contentDiv.text()).toContain(blog.url)
  })

  it('should only show title and author after toggling twice', () => {
    const clickableDiv = blogComponent.find('.togglableContent')
    clickableDiv.simulate('click')
    clickableDiv.simulate('click')

    const contentDiv = blogComponent.find('.blogContent')
    expect(contentDiv.text()).toContain(blog.title)
    expect(contentDiv.text()).toContain(blog.author)
    expect(contentDiv.text()).not.toContain(blog.likes)
    expect(contentDiv.text()).not.toContain(blog.url)
  })
})