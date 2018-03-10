import React from 'react'
import BlogList from './components/BlogList'
import UserList from './components/UserList'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      asdf: 1,
      user: { username: 'joni' }
    }
  }

  async componentDidMount() {
  }

  render () {
    const header = () => (
      <div>
        <h2>Blog app</h2>
        {this.state.user.username} logged in
        <button type="button" onClick={this.logout}>logout</button>
      </div>
    )

    return (
      <div>
        <Router>
            <div>
              {header()}
              <Route path="/blogs" render={() => <BlogList />} />
              <Route path="/users" render={() => <UserList />} />
            </div>
        </Router>
      </div>
    );
  }
}

export default App;