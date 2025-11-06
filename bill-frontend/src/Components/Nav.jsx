import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { useLoginMutation, useLogoutMutation, useMeQuery } from '../app/AuthSlice.js'
import { useNavigate } from 'react-router-dom'
import keyImage from '../assets/key.svg'
import personImage from '../assets/person.svg'
import bankImage from '../assets/bank.png'
import styles from '../styles/Nav.module.css'

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
        <div className={styles.headerContainer}>
                <img className= {styles.headerImage} src={bankImage}/>
            {loggedIn?(
                    <nav className={styles.navContainer}>
                            <Link className={styles.navButton} to="/bills">
                                    Bills
                            </Link>
                            <Link className={styles.navButton} to="/banks">
                                <div>
                                    Banks
                                </div>
                            </Link>
                            <div className={styles.logoutContainer}>
                                <button id={styles.logoutButton} className="bad-button" type="button" onClick={handleLogout}>Logout</button>
                            </div>  
                    </nav>
                
        ):(
            <nav className={styles.navContainer}>
                <Link className={styles.navButton} to="/signup">
                        Signup
                </Link>
                    <div className={styles.loginContainer}>
                        <div className={styles.inputContainer}>
                        <form className={styles.formContainer} onSubmit={handleLogin}>
                                <div className={styles.loginFlex}>
                                    <div className={styles.inputFormatter}>
                                        <img className={styles.tag} src={personImage}/>
                                        |
                                        <input
                                        className={styles.loginField}
                                        type="text"
                                        name="username"
                                        placeholder='Username'
                                        value={userData.username}
                                        onChange={updatedUserData}
                                        required
                                        />
                                    </div>
                                    <div className={styles.inputFormatter}>
                                        <img className={styles.tag} src={keyImage}/>
                                        |
                                        <input
                                        className={styles.loginField}
                                        type="password"
                                        name="password"
                                        placeholder='Password'
                                        value={userData.password}
                                        onChange={updatedUserData}
                                        required
                                        />
                                    </div>
                                </div>
                                <button className={styles.loginButton} type="submit">Log in</button>
                        </form>
                        </div>
                    </div>
            </nav>
        )
        
        }
        </div>
    )
}

export default Nav