import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { useLoginMutation, useLogoutMutation, useMeQuery } from '../app/AuthSlice.js'
import { useNavigate } from 'react-router-dom'
import keyImage from '../assets/key.svg'
import personImage from '../assets/person.svg'

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
                navigate('/home')
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
                <>
                    <nav className='nav-container'>
                            <Link className='nav-button' to="/bills">
                                    Bills
                            </Link>
                            <Link className='nav-button' to="/banks">
                                <div>
                                    Banks
                                </div>
                            </Link>
                            <button className='logout-button' type="button" onClick={handleLogout}>Logout</button>  
                    </nav>
                
            </> 
        ):(
            <nav className='nav-container'>
                <Link className='nav-button' to="/signup">
                        Signup
                </Link>
                <div>
                    <form className='form-container' onSubmit={handleLogin}>
                        <div className='input-container'>
                            <div>
                                <div className="input-formatter">
                                    <img className='tag' src={personImage}/>
                                    |
                                    <input
                                    className="input"
                                    type="text"
                                    name="username"
                                    placeholder='Username'
                                    value={userData.username}
                                    onChange={updatedUserData}
                                    required
                                    />
                                </div>
                                <div className="input-formatter">
                                    <img className='tag' src={keyImage}/>
                                    |
                                    <input
                                    className="input"
                                    type="password"
                                    name="password"
                                    placeholder='Password'
                                    value={userData.password}
                                    onChange={updatedUserData}
                                    required
                                    />
                                </div>
                            </div>
                        <button id='login-button' type="submit">Log in</button>
                        </div>
                    </form>
                    <div>
                        {errorMessage}
                    </div>
                </div>
            </nav>
        )
        }
        </div>
    )
}

export default Nav