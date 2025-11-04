import { Routes, Route } from 'react-router-dom'
import Nav from './Components/Nav.jsx'
import Home from './Pages/Home.jsx'
import AllBills from './Pages/AllBills.jsx'
import Banks from './Pages/Banks.jsx'
import './App.css'

function App() {



    return(
      <>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bills" element={<AllBills />}/>
          <Route path="/banks" element={<Banks />} />
        </Routes>
      </>
    )
  }

export default App
