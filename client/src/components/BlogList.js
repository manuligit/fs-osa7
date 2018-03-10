import React from 'react'
import Blog from './Blog'
import blogService from './../services/blogs'
import loginService from './../services/login'
import CreateBlogForm from './CreateBlogForm'
import Notification from './Notification'
import LoginForm from './LoginForm'
import Togglable from './Togglable'
import './../index.css'

class BlogList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      title: '',
      author: '',
      url: '',
      message: null,
      loginVisible: false,
      username: '',
      password: '',
      user: null
    }
  }

  async componentDidMount() {
    const blogs = await blogService.getAll()

    blogs.sort(function (a, b) {
      return a.likes < b.likes
    })

    this.setState({ blogs: blogs})
  
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({user})
      blogService.setToken(user.token)
    }

    return Promise.resolve()
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

      this.setState({ message: `${newBlog.title} created successfully` })
      setTimeout(() => {
        this.setState({ message: null })
      }, 5000)

    }
    catch (error) {
      console.log(error.name)
    }
  }

  addLike = async (event) => {
    event.preventDefault()
    try {
      const id = event.target.value
      //get the original blog object
      let blog = await blogService.getOne(id)
      //copy it to add one to it's likes
      console.log(blog.likes)
      const addedLike = {...blog, likes: blog.likes+1}
      //update the object and blog list
      await blogService.update(id, addedLike)
      let blogs = this.state.blogs.map(blog => blog.id !== id ? blog : addedLike)

      blogs.sort(function (a, b) {
        return a.likes < b.likes
      })


      this.setState({
        blogs: blogs
      })

      this.setState({ message: `Liked ${blog.title} `})
      setTimeout(() => {
        this.setState({ message: null })
      }, 5000)
    }
    catch (error) {
      console.log(error)
    }
  }

  deleteBlog = async (event) => {
    //delete blog lul
    const id = event.target.value
    console.log(this.state.blogs)
    console.log(id)
    console.log(this.state.user.token)
    try {
      let response = await blogService.remove(id, this.state.user.token)
      console.log(response)
      console.log("delete ok, creating blog list")
      console.log("state blogs length", this.state.blogs.length)
      let blogs = this.state.blogs.filter(blog => blog.id !== id)
      console.log("current blogs length", blogs.length)
      
      blogs.sort(function (a, b) {
        return a.likes < b.likes
      })

      this.setState({
        blogs: blogs
      })

      this.setState({ message: `Deleted blog `})
      setTimeout(() => {
        this.setState({ message: null })
      }, 5000)

    } catch (error) {
      console.log('could not delete, error ' + error.name)
    }

  }

  login = async (event) => {
    event.preventDefault()
    try{
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      this.setState({ username: '', password: '', user})

      this.setState({ message: `Logged in successfully` })
      setTimeout(() => {
        this.setState({ message: null })
      }, 5000)


    } catch(exception) {
      this.setState({
        message: 'Wrong username or password',
      })
      setTimeout(() => {
        this.setState({ message: null })
      }, 5000)
    }
  }

  logout = () => {
    window.localStorage.clear()

    this.setState({ message: `Logged out successfully`, 
                    username: '',
                    password: '',
                    user: null, })
    setTimeout(() => {
      this.setState({ message: null })
    }, 5000)
  }

  render() {
    const blogList = () => (
      <div>
        {this.state.blogs.map(blog => <div key={blog.id}>
          <Blog blog={blog} like={this.addLike} delete={this.deleteBlog} currentUser={this.state.user}/></div>
        )}

        <CreateBlogForm title={this.state.title} author={this.state.author} url={this.state.url} 
                createBlog={this.createBlog.bind(this)} 
                handleFormFieldChange={this.handleFormFieldChange.bind(this)} />
      </div>
    )

    const loginForm = () => {
      return (
        <Togglable buttonLabel="Login">
            <LoginForm login={this.login} 
                       username={this.state.username}
                       handleFormFieldChange={this.handleFormFieldChange} 
                       password={this.state.password}/>
        </Togglable>
      )

    }
    return (
      <div>
        <Notification message={this.state.message} />
        {this.state.user === null && loginForm() }

        {this.state.user !== null && blogList()}
      </div>
    );
  }
}

export default BlogList;