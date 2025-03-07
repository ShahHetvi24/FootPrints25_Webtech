import React from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleSpillTheTeaClick = () => {
    navigate('/teatok'); // Navigate to /teatok
  };

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to /teatok
  };

  return (
    <div className="min-h-screen bg-[var(--home-bg-color)]">
      <nav className="px-6 py-4 flex justify-end">
        <button className="bg-[var(--button-color)] text-white font-medium px-4 py-2 rounded-lg" onClick={handleLoginClick}>
          Login
        </button>
      </nav>
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center" style={{ minHeight: "calc(100vh - 80px)" }}>
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--title-color)] mb-6">
            Welcome to <span className="text-[var(--title-color)]">DarkRoom</span>
          </h1>
          <p className="text-[20px] text-[var(--text-color)]">
            Literally the place where you can spill the tea with zero receipts.
          </p>
          <p className="text-[18px] text-[var(--text-color)] mb-8">
            Drop your thoughts, confessions, or whatever's living rent-free in your head without anyone knowing it's you. No names, no faces, just pure unfiltered vibes. Unleash your darkside!
          </p>
          <button 
            onClick={handleSpillTheTeaClick} // Handle button click
            className="bg-[var(--button-color)] text-white font-medium px-8 py-3 rounded-lg shadow-md text-lg transition duration-300 transform hover:scale-105"
          >
            Spill the Tea
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
