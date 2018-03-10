import React from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ login, username, handleFormFieldChange, password }) => {

  return (
    <div>
      <h2>Login to application</h2>
      <form onSubmit={login}>
        <div> Username
          <input 
            type="text" 
            name="username"
            value={username}
            onChange={handleFormFieldChange}
          />
        </div>
        <div> Password
          <input 
            type="password"
            name="password"
            value={password}
            onChange={handleFormFieldChange}
            />
        </div>
        <button type="submit">Kirjaudu</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
  handleFormFieldChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm