import React from 'react'
import blogService from './../services/blogs'
import CreateBlogForm from './CreateBlogForm'
import { Link } from 'react-router-dom'
import './../index.css'

class BlogList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      title: '',
      author: '',
      url: '',
      user: null
    }
  }

  async componentDidMount() {
    const blogs = await blogService.getAll()

    blogs.sort(function (a, b) {
      return a.likes < b.likes
    })

    this.setState({ blogs: blogs, user: this.props.user })
  } 

  handleFormFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  createBlog = (event) => {
    event.preventDefault()
    console.log("creating a blog", this.state.title)
    let newBlog = {
      title: this.state.title,
      author: this.state.author,
      url: this.state.url,
      user: this.state.user
    }
    try { 
      blogService.create(newBlog)
      let blogs = this.state.blogs.concat({...newBlog, likes: 0})
      this.setState({ 
        author: '',
        title: '',
        url: '',
        blogs: blogs
      })
      this.props.notify(`${newBlog.title} created successfully`) 
    }
    catch (error) {
      console.log('components createblog error:')
      console.log(error.name)
    }
  }

  render() {
    const blogStyle = {
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5
    } 

    const blogList = () => (
      <div>
        {this.state.blogs.map(blog => <div key={blog.id} style={blogStyle}>
          <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link></div>
        )}

        <CreateBlogForm title={this.state.title} author={this.state.author} url={this.state.url} 
                createBlog={this.createBlog.bind(this)} 
                handleFormFieldChange={this.handleFormFieldChange.bind(this)} />
      </div>
    )

    return (
      <div>
        {this.state.user !== null && blogList()}
      </div>
    );
  }
}

export default BlogList;