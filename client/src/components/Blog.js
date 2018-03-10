import React from 'react'
import blogService from './../services/blogs'

const Blog = ({ blog, notify, currentUser }) => {
  const addLike = async (event) => {
    event.preventDefault()
    try {
      const id = event.target.value
      //get the original blog object
      let blog = await blogService.getOne(id)
      //copy it to add one to it's likes
      console.log(blog.likes)
      const addedLike = {...blog, likes: blog.likes+1}
      //update the object and blog list
      let blogs = await blogService.getAll()
      await blogService.update(id, addedLike)
      notify(`Liked ${blog.title} `) 
      blog.likes = blog.likes + 1
    }
    catch (error) {
      console.log(error)
    }
  }


  const deleteBlog = async (event) => {
    const id = event.target.value
    console.log(id)
    console.log(currentUser.token)
    try {
      let response = await blogService.remove(id, currentUser.token)
      console.log(response)
      this.props.notify(`Deleted blog `)

    } catch (error) {
      console.log('could not delete, error ' + error.name)
    }
  }

  const bloguser = (blog.user || {})
  console.log(currentUser)
  console.log('helloblog')
  console.log(blog.user.name)
  return (
    <div>
        {blog.title} by {blog.author}<br/>
        <a href={blog.url}>{blog.url}</a><br/>
        {blog.likes} likes 
        <button onClick={addLike} value={blog.id}>like</button><br/>
        
        {currentUser && 
        currentUser.name === bloguser.name ? (<button onClick={deleteBlog} value={blog.id}>delete</button>) : null }

    </div>
  )
}


export default Blog