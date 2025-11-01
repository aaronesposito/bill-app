import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { useLoginMutation, useLogoutMutation, useMeQuery } from '../app/AuthSlice.js'
import { useNavigate } from 'react-router-dom'

function Nav() {

    const { data: user, isLoading, isError, error, refetch} = useMeQuery()
    const [logout, logoutResponse] = useLogoutMutation()
    const [errorMessage, setErrorMessage] = useState("")
    const [userData, setUserData] = useState({username: "", password: ""})
    const [login, loginResponse] = useLoginMutation()
    const navigate = useNavigate()

    const updatedUserData = (e) => {
      const {name, value} = e.target
      setUserData(prev => ({
          ...prev,
          [name]: value
      }))
  }

  const handleLogin = async (e) => {
      e.preventDefault()
      try {
        const data = await login(userData).unwrap()
        await refetch()
        if (data?.success) {
          navigate('/bills')
        }
      }catch (err){
         setErrorMessage(err?.data?.error ?? 'Login error')
      }finally{
        setUserData({username: "", password: ""})
      }
  }

    const handleLogout = async () => {
        try {
            const res = await logout().unwrap()
            if (res.success) {
                navigate('/')
                }
        }catch (err){
            setErrorMessage(err?.data?.error ?? 'Logout error');
        }
    };

    const loggedIn = !!user?.loggedIn;

    if (isError) {
        return <div>Error</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {loggedIn?(
                <div>
                    <nav>
                        <div>
                            <Link to="/">
                                Home
                            </Link>
                        </div>
                        <div>
                            <Link to="/bills">
                                Bills
                            </Link>
                        </div>
                        <div>
                            <Link to="/bills/create">
                                Create Bill
                            </Link>
                        </div>
                        <div>
                            <Link to="/Link 4">
                                Link 4
                            </Link>
                        </div>
                    </nav>
                <button type="button" onClick={handleLogout}>Logout</button>  
            </div> 
        ):(
            <div>
                <form onSubmit={handleLogin}>
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
                    <button type="submit">Log in</button>
                </form>
                <div>
                    {errorMessage}
                </div>
            </div>
        )
        }
        </div>
    )
}

export default Nav