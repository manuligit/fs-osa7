import React from 'react'
import blogService from './../services/blogs'

const Blog = ({ blog }) => {

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
      let blogs2 = blogs.map(blog => blog.id !== id ? blog : addedLike)

      blogs2.sort(function (a, b) {
        return a.likes < b.likes
      })


      //this.setState({
      //  blogs: blogs
      //})

      //this.setState({ message: `Liked ${blog.title} `})
      //setTimeout(() => {
      //  this.setState({ message: null })
      //}, 5000)
    }
    catch (error) {
      console.log(error)
    }
  }

  console.log('helloblog')
  console.log(blog)
  return (
    <div>
        {blog.title} by {blog.author}<br/>
        <a href={blog.url}>{blog.url}</a><br/>
        {blog.likes} likes 
        <button onClick={addLike} value={blog.id}>like</button><br/>
    </div>
  )
}


export default Blog