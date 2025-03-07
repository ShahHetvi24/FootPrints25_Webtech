import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from 'react'
import Homepage from './components/Homepage'
import Slider from './components/Slider'
// import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/teatok" element={<Slider />} />
      </Routes>
    </Router>
  )
}

export default App
