import React, { useState, useEffect, useRef } from 'react';
import { X, Menu } from 'lucide-react'; // Assuming you're using lucide-react for icons

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null); // Reference to the sidebar
  const buttonRef = useRef(null); // Reference to the toggle button

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen((prevState) => !prevState);
  };

  // Close sidebar if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false); // Close sidebar if clicked outside
      }
    };

    // Add event listener for clicks outside
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Clean up event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      {/* Sidebar Toggle Button */}
      <button
        ref={buttonRef}
        onClick={toggleSidebar}
        className="absolute top-4 left-5 bg-[var(--button-color)] text-white p-2 rounded-md"
      >
        {isOpen ? (
          <X size={24} /> // Show cross when sidebar is open
        ) : (
          <Menu size={24} /> // Show hamburger menu when sidebar is closed
        )}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-10 left-2 h-full bg-[var(--sidebar-bg-color)] w-1/2 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 text-white">
          {/* <h2 className="text-xl font-bold">Sidebar</h2> */}
          <ul className="mt-6 space-y-4">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </div>

      {/* Content Overlay */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-1/5 h-full bg-black opacity-50 z-10"
          onClick={() => setIsOpen(false)} // Close sidebar when clicking on overlay
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
