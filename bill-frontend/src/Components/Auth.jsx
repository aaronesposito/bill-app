import {useState} from 'react'

import { useNavigate } from 'react-router-dom'

function Auth() {


    
    const { data: user, isLoading, isError, error} = useMeQuery()
    const navigate = useNavigate()




    return (
      <>
        <form>
          <label>
            Username
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={updatedUserData}
              required
            />
          </label>
          <br/>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={updatedUserData}
              required
            />
          </label>
          <br/>
          <button type="button" onClick={handleLogin}>Log in</button>
        </form>
        <div>
          {errorMessage}
        </div>
      </>
    )
}

export default Auth