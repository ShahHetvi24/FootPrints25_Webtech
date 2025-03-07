import React from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ icon, title, description }) => {
  const navigate = useNavigate();
  
  const handleChatClick = () => {
    // Navigate to the chat page and pass the selected chat title as state
    navigate('/chat', { state: { selectedChatName: title } });
  };
    
  return (
    <div className="flex flex-col bg-[var(--title-color)] bg-opacity-1 rounded-xl overflow-hidden h-[400px] p-3">
      <div className="relative h-48 flex justify-center items-center overflow-hidden">
        {icon}
      </div>
        
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-xl mb-2 text-black">{title}</h3>
        <p className="text-white mb-4 flex-1">{description}</p>
        <button 
          className="mt-auto w-full bg-[var(--button-color)] text-white font-medium py-2 px-4 rounded transition-colors duration-200"
          onClick={handleChatClick}
        >
          {"Chat Anonymously"}
        </button>
      </div>
    </div>
  );
};

export default Card;