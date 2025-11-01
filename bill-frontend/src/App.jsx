import { Routes, Route } from 'react-router-dom'
import Nav from './Components/Nav.jsx'
import Home from './Pages/Home.jsx'
import AllBills from './Pages/AllBills.jsx'
import CreateBill from './Pages/UpdateBill.jsx'
import './App.css'

function App() {



    return(
      <>
        <Nav />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/bills" element={<AllBills />} />
          <Route path="/bills/create" element={<CreateBill />} />
        </Routes>
      </>
    )
  }

export default App
