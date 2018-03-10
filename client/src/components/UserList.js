import React from 'react'
import userService from './../services/users'

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
          {this.state.users.map(user => <tr key={user.id}><td>{user.name}</td><td>{user.blogs.length}</td></tr>)}
          </tbody>
        </table>
      </div>
    )
  }
}

export default UserList