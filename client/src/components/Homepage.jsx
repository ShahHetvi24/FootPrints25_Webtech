import React from 'react';
import { useNavigate } from 'react-router-dom';
import LetterGlitch from './LetterGlitch';

const Homepage = () => {
  const navigate = useNavigate(); // Initialize navigate function
  
  const handleSpillTheTeaClick = () => {
    navigate('/teatok'); // Navigate to /teatok
  };
  
  const handleLoginClick = () => {
    navigate('/login'); // Navigate to /login
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* LetterGlitch Background */}
      <div className="absolute inset-0 z-0">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 min-h-screen">
        <nav className="px-6 py-4 flex justify-end">
          <button className="bg-[var(--button-color)] text-white font-medium px-4 py-2 rounded-lg" onClick={handleLoginClick}>
            Login
          </button>
        </nav>
        <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center" style={{ minHeight: "calc(100vh - 80px)" }}>
          <div className="max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold p-2 rounded-lg text-[var(--title-color)] mb-6">
              Welcome to <span className="text-[var(--title-color)]">DarkRoom</span>
            </h1>
            <div className='text-white p-3 rounded-lg mb-5'>

            <p className="text-[20px]">
              Literally the place where you can spill the tea with zero receipts.
            </p>
            <p className="text-[18px]">
              Drop your thoughts, confessions, or whatever's living rent-free in your head without anyone knowing it's you. No names, no faces, just pure unfiltered vibes. Unleash your darkside!
            </p>
            </div>
            <button
              onClick={handleSpillTheTeaClick} // Handle button click
              className="bg-[var(--button-color)] text-white font-medium px-8 py-3 rounded-lg shadow-md text-lg transition duration-300 transform hover:scale-105"
            >
              Spill the Tea
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;