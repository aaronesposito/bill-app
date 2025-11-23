import { Routes, Route } from 'react-router-dom'
import Nav from './Components/Nav.jsx'
import Home from './Pages/Home.jsx'
import AllBills from './Pages/AllBills.jsx'
import Banks from './Pages/Banks.jsx'
import SignUp from './Pages/SignUp.jsx'
import Success from './Pages/Success.jsx'
import OneBill from './Pages/OneBill.jsx'
import "./styles/App.css"


function App() {



    return(
      <>
        <Nav />
        <div className="outer-wrapper">
          <div className="main-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bills" element={<AllBills />}/>
              <Route path="/bills/:id" element={<OneBill />}/>
              <Route path="/banks" element={<Banks />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/success" element={<Success />} />
            </Routes>
          </div>
        </div>
      </>
    )
  }

export default App

