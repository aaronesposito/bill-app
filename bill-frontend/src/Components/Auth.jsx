import {useState, useEffect} from 'react'
import checkSession from '../Utils/Session.js'

function Auth({handleLinks}) {


    const [login, setLogin] = useState({username: "", password: ""})
    const [loggedIn, setLoggedIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [auth, setAuth] = useState({
    loading: true,
    loggedIn: false,
    user: null
  });

    const updatedLogin = (e) => {
      const {name, value} = e.target
      setLogin(prev => ({
          ...prev,
          [name]: value
      }))
  }

  const handleLogin = (e) => {
      e.preventDefault()
      fetch('http://localhost:8081/auth/login', {
          method: 'POST',
          headers: {'Accept': 'application/json',
              'Content-Type': 'application/json',
              },
          credentials: 'include',
          body: JSON.stringify(login)
      })
      .then(response=>{
        if (response.status == 400) {
          setErrorMessage("Invalid Login Information")
          handleLinks(false)
        }
        else {
          setLoggedIn(true)
          handleLinks(true)
        }
      })
  }

  const handleLogout = async () => {
  await fetch('http://localhost:8081/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
    setAuth({
      loading: false,
      loggedIn: false,
      user: null
    });
    setLogin({username: "", password: ""})
    handleLinks(false)
  };

  useEffect(() => {
    (async () => {
      const result = await checkSession();
      setAuth({
        loading: false,
        loggedIn: result.loggedIn,
        user: result.user
      });
    })();
  }, [loggedIn]);

    return (
      <>
        {auth.loggedIn ? (
          <>
            <div>Hi, {auth.user}</div>
            <button type="button" onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            <form onSubmit={handleLogin}>
              <label>
                Username
                <input
                  type="text"
                  name="username"
                  value={login.username}
                  onChange={updatedLogin}
                  required
                />
              </label>
              <br/>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={login.password}
                  onChange={updatedLogin}
                  required
                />
              </label>
              <br/>
              <button type="submit">Log in</button>
            </form>
            <div>
              {errorMessage}
            </div>
          </>
        )}
      </>
    )
}

export default Auth