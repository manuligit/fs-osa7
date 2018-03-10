import React from 'react'
import BlogList from './components/BlogList'
import UserList from './components/UserList'
import User from './components/User'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import { BrowserRouter as Router, Route } from 'react-router-dom'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loginVisible: false,
      username: '',
      password: '',
      user: null,
      users: null
    }
  }

  async componentDidMount() {
    const users = await userService.getAll()
    console.log(users)
    this.setState({ users: users })

    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({user})
      blogService.setToken(user.token)
    }
    console.log(loggedUserJSON)
    return Promise.resolve()
  }

  handleFormFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
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

  render () {
    const header = () => (
      <div>
        <h2>Blog app</h2>
        {this.state.user.username} logged in
        <button type="button" onClick={this.logout}>logout</button>
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

    const userById = (id) => this.state.users.find(user => user.id === id)

    return (
      <div>
        <Router>
            <div>
              {this.state.user !== null && header()}
              {this.state.user === null && loginForm() }
              
              {this.state.user !== null && <Route exact path="/blogs" render={() => <BlogList user={this.state.user}/>} />}

              <Route exact path="/users" render={() => <UserList />} />
              {this.state.users !== null && <Route exact path="/users/:id" render={({match}) =>
              <User user={userById(match.params.id)} />}
              /> }
            </div>
        </Router>
      </div>
    );
    
  }
}

export default App;