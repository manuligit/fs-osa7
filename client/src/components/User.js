import React from 'react'

const User = ({ user }) => {
  const blogList = () => { 
    return (
      <div>
        <h2>Added blogs</h2>
        <ul>
          { user.blogs.map(blog => <li key={blog._id}>{blog.title}</li> )}
        </ul>
      </div>
    )
  }

  return (
    <div>
      <h1>{user.name}</h1>
      {user.blogs.length === 0 && <p>No added blogs.</p> }
      {user.blogs.length > 0 && blogList() }
    </div>
  )
}


export default User