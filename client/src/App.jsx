import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from 'react'
import Homepage from './components/Homepage'
import Slider from './components/Slider'
import LoginPage from "./components/Loginpage";

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/teatok" element={<Slider />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App
