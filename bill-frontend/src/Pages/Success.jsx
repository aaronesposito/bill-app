import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


function Success(){

    const [timer, setTimer] = useState(5)
    const navigate = useNavigate()

    useEffect(()=>{
        if(timer<=0){
            navigate('/')
        }
    },[timer])

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevCount) => prevCount - 1);
        }, 1000);

        return () => clearInterval(interval); 
    }, []); 

    return(
        <>
            <div>Account Create Successfully!</div>
        </>
    )
}

export default Success