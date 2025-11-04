import { useState, useEffect } from "react"
import { useLoginMutation, useSignupMutation } from "../app/AuthSlice"
import { useNavigate } from "react-router-dom"


function SignUp(){

    const [signup,signUpResposnse] = useSignupMutation()
    const [accountData, setAccountData] = useState({full_name:"", username:"", password:""})
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()

    const handleChange=(e)=>{
        const {name, value} = e.target
        setAccountData(prev=>({
            ...prev,
            [name]:value
        }))
    }

    const handleCancel=()=>{
        navigate('/')
    }

    const handleConfirmationChange=(e)=>{
        setPasswordConfirmation(e.target.value)
    }

    const resetPasswords=()=>{
        setAccountData(prev=>({
                ...prev,
                ['password']:""
            }))
        setPasswordConfirmation("")
    }

    const validatePassword=()=>{
        if(passwordConfirmation !== accountData.password){
            setErrorMessage("Passwords do not match")
            resetPasswords()
            return false
        }else if(accountData.password.length < 8){
            setErrorMessage("Password too short")
            resetPasswords()
            return false
        }else{
            return true
        }
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        if(validatePassword()){
            try{
                const res = await signup(accountData).unwrap()
                if (res?.success){
                    navigate("/success")
                }
            }catch (res){
                setErrorMessage(res?.error ?? 'Signup error')
            }finally{
                setAccountData({full_name:"", username:"", password:""})
            }
        }
    }

    return(
        <>
        <form onSubmit={handleSubmit}>
            <label>
                Name 
                <input
                    type='text'
                    name="full_name"
                    value={accountData.full_name}
                    onChange={handleChange}
                    required
                />
            </label>
            <br/>
            <label>
                Username 
                <input
                    type='text'
                    name='username'
                    value={accountData.username}
                    onChange={handleChange}
                    required
                />
            </label>
            <br/>
            <label>
                Password
                <input
                    type='password'
                    name='password'
                    value={accountData.password}
                    onChange={handleChange}
                    required
                />
            </label>
            <br/>
            <label>
                Password
                <input
                    type='password'
                    value={passwordConfirmation}
                    onChange={handleConfirmationChange}
                    required
                />
            </label>
            <br/>
            <button type='submit'>Submit</button>
        </form>
        {errorMessage?(<div>{errorMessage}</div>):(<></>)}
        <button type='button' onClick={handleCancel}>Cancel</button>
        </>
    )
}

export default SignUp