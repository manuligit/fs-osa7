import React from 'react'
const CreateBlogForm = ({ createBlog, handleFormFieldChange, title, author, url }) => (
  <div>
  <h2>Create new blog</h2>
  <form onSubmit={createBlog}>
    <div> Title
      <input 
        type="text" 
        name="title"
        value={title}
        onChange={handleFormFieldChange}
      />
    </div>
    <div> Author
      <input 
        type="text"
        name="author"
        value={author}
        onChange={handleFormFieldChange}
        />
    </div>
    <div> Url
      <input 
        type="text"
        name="url"
        value={url}
        onChange={handleFormFieldChange}
        />
    </div>
    <button type="submit">Create</button>
  </form>
</div>
)

export default CreateBlogForm