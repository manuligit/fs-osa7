import React from 'react'
import { shallow } from 'enzyme'
import SimpleBlog from './SimpleBlog'

describe.only('<SimpleBlog />', () => {
  it('renders content', () => {
    const blog = {
      title: 'titteli',
      author: 'kirjoittaja',
      likes: 3
    }

    const blogComponent = shallow(<SimpleBlog blog={blog} />)
    const contentDiv = blogComponent.find('.content')
    console.log(blogComponent.debug())

    expect(contentDiv.text()).toContain(blog.title)
    expect(contentDiv.text()).toContain(blog.author)

    const likesDiv = blogComponent.find('.likes')

    expect(likesDiv.text()).toContain(blog.likes)
  })

  it('reacts to click twice', () => {
    const blog = {
      title: 'titteli',
      author: 'kirjoittaja',
      likes: 3
    }

    const mockHandler = jest.fn()

    const blogComponent = shallow(<SimpleBlog blog={blog} onClick={mockHandler} />)

    const button = blogComponent.find('button')
    button.simulate('click')
    button.simulate('click')
    
    expect(mockHandler.mock.calls.length).toBe(2)
  })
})