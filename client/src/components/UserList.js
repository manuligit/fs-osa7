import React from 'react'
import userService from './../services/users'
import { Link } from 'react-router-dom'


class UserList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: []
    }
  }

  async componentDidMount() {
    const users =  await userService.getAll()
    this.setState({ users: users })
  }
  
  render () {
    return (
      <div>
        <h2>Users</h2>
        <table>
          <tbody>
          <tr><td>Name</td><td>blogs added</td></tr>
          {this.state.users.map(user => <tr key={user.id}><td><Link to={`/users/${user.id}`}>{user.name}</Link></td><td>{user.blogs.length}</td></tr>)}
          </tbody>
        </table>
      </div>
    )
  }
}

export default UserList