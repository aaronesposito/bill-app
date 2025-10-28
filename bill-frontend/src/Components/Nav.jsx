import { useState } from 'react'
import { Link } from "react-router-dom"
import Auth from './Auth.jsx'


function Nav() {

    const [showLinks, setShowLinks] = useState(false)

    const handleLinks = (active) => {
        setShowLinks(active)
    }

    return (
        <>
        {showLinks?(
        <>
            <nav>
                <div>
                    <Link to="/home">
                        <s>Link 1</s>
                    </Link>
                </div>
                <div>
                    <Link to="/Link 2">
                        <s>Link 2</s>
                    </Link>
                </div>
                <div>
                    <Link to="/Link 3">
                        <s>Link 3</s>
                    </Link>
                </div>
                <div>
                    <Link to="/Link 4">
                        <s>Link 4</s>
                    </Link>
                </div>
            </nav>
            <Auth handleLinks={handleLinks}/>
        </>
        ):(
            <Auth handleLinks={handleLinks}/>
        )
        }
    </>
    )
}

export default Nav