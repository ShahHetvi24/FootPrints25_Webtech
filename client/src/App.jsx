import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from 'react'
import Homepage from './components/Homepage'
import TeatokPage from './components/TeatokPage'
import LoginPage from "./components/Loginpage";
import ChatWindow from "./components/ChatWindow";

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/teatok" element={<TeatokPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat" element={<ChatWindow />} />
      </Routes>
    </Router>
  )
}

export default App
