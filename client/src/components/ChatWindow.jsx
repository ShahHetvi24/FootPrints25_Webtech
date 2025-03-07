import { X, Menu, Plus, SendHorizontal, ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WhatsAppClone = () => {
    const navigate = useNavigate();

  const handleBack = () => {
    navigate("/home");
  };
  // Hardcoded chat data
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Data Den",
      lastMessage: "Hey, how are you?",
      time: "10:30 AM",
      unreadCount: 3,
      messages: [
        { id: 1, text: "Hey there!", sender: "them", time: "10:15 AM" },
        { id: 2, text: "How's it going?", sender: "them", time: "10:20 AM" },
        { id: 3, text: "I was wondering if you're free this weekend.", sender: "them", time: "10:30 AM" }
      ]
    },
    {
      id: 2,
      name: "Rivet Crew",
      lastMessage: "Don't forget our meeting!",
      time: "9:45 AM",
      unreadCount: 1,
      messages: [
        { id: 1, text: "Hi, can we talk about the project?", sender: "them", time: "9:30 AM" },
        { id: 2, text: "Sure, what's up?", sender: "me", time: "9:35 AM" },
        { id: 3, text: "Don't forget our meeting!", sender: "them", time: "9:45 AM" }
      ]
    },
    {
      id: 3,
      name: "Circuit Society",
      lastMessage: "Alice: I'll send the files soon",
      time: "Yesterday",
      unreadCount: 0,
      messages: [
        { id: 1, text: "Bob: Has everyone reviewed the proposal?", sender: "them", time: "Yesterday" },
        { id: 2, text: "Yes, looks good to me!", sender: "me", time: "Yesterday" },
        { id: 3, text: "Alice: I'll send the files soon", sender: "them", time: "Yesterday" }
      ]
    },
    {
      id: 4,
      name: "Terrain Tribe",
      lastMessage: "Alice: I'll send the files soon",
      time: "Yesterday",
      unreadCount: 0,
      messages: [
        { id: 1, text: "Bob: Has everyone reviewed the proposal?", sender: "them", time: "Yesterday" },
        { id: 2, text: "Yes, looks good to me!", sender: "me", time: "Yesterday" },
        { id: 3, text: "Alice: I'll send the files soon", sender: "them", time: "Yesterday" }
      ]
    },
    {
      id: 5,
      name: "Catalyst",
      lastMessage: "Alice: I'll send the files soon",
      time: "Yesterday",
      unreadCount: 0,
      messages: [
        { id: 1, text: "Bob: Has everyone reviewed the proposal?", sender: "them", time: "Yesterday" },
        { id: 2, text: "Yes, looks good to me!", sender: "me", time: "Yesterday" },
        { id: 3, text: "Alice: I'll send the files soon", sender: "them", time: "Yesterday" }
      ]
    },
    {
      id: 6,
      name: "BuzzPub",
      lastMessage: "Alice: I'll send the files soon",
      time: "Yesterday",
      unreadCount: 0,
      messages: [
        { id: 1, text: "Bob: Has everyone reviewed the proposal?", sender: "them", time: "Yesterday" },
        { id: 2, text: "Yes, looks good to me!", sender: "me", time: "Yesterday" },
        { id: 3, text: "Alice: I'll send the files soon", sender: "them", time: "Yesterday" }
      ]
    }
  ]);

  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleChatSelect = (chat) => {
    // Clear unread count when selecting a chat
    const updatedChats = chats.map(c => 
      c.id === chat.id ? { ...c, unreadCount: 0 } : c
    );
    setChats(updatedChats);
    setSelectedChat(chat);
    
    // On mobile, close sidebar after selecting a chat
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: selectedChat.messages.length + 1,
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedChats = chats.map(chat => 
      chat.id === selectedChat.id 
        ? { 
            ...chat, 
            messages: [...chat.messages, newMsg],
            lastMessage: `You: ${newMessage}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          } 
        : chat
    );
    
    setChats(updatedChats);
    setSelectedChat({
      ...selectedChat,
      messages: [...selectedChat.messages, newMsg],
      lastMessage: `You: ${newMessage}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setNewMessage("");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewChat = () => {
    // Placeholder function for creating a new chat
    alert("Create new chat functionality would go here");
  };

  return (
    <div className="flex h-screen bg-[var(--home-bg-color)]">
      {/* Sidebar - conditionally rendered based on isSidebarOpen state */}
      {isSidebarOpen && (
        <div className="w-full md:w-1/3 bg-white  flex flex-col z-10 h-full">
          <div className="bg-[var(--home-bg-color)] p-3 flex items-center justify-between">
            <div className="font-semibold text-white text-lg">TeaTok</div>
            <div className="flex space-x-2">
                <button className='p-2 bg-[var(--button-color)] rounded-full text-white hover:bg-opacity-80'
                onClick={handleBack}>
                <ArrowLeft size={20} />
                </button>
              <button 
                className="p-2 bg-[var(--button-color)] rounded-full text-white hover:bg-opacity-80"
                onClick={toggleSidebar}
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="p-2 bg-[var(--home-bg-color)]">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search or start new chat" 
                className="w-full p-2 pl-8 bg-white rounded-lg focus:outline-none"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Chat list */}
          <div className="overflow-y-auto flex-1 bg-[var(--home-bg-color)]">
            {chats.map(chat => (
              <div 
                key={chat.id}
                className={`flex items-center p-3 cursor-pointer hover:bg-[var(--home-bg-color)] ${selectedChat.id === chat.id ? 'bg-[var(--home-bg-color)]' : ''}`}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="w-12 h-12 bg-[var(--button-color)] rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {chat.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-white">{chat.name}</h3>
                    <span className="text-xs text-white">{chat.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-white truncate">{chat.lastMessage}</p>
                    {chat.unreadCount > 0 && (
                      <span className=" bg-slate-300 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* New chat button at the bottom of sidebar */}
          <div className="p-4 bg-[var(--home-bg-color)]">
            <button 
              className="w-full flex items-center justify-center p-2 bg-[var(--button-color)] text-white rounded-lg"
              onClick={handleNewChat}
            >
              <Plus size={20} className="mr-2" />
              <span>Custom TeaTok</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="bg-[var(--chat-bg-color)] p-3 flex items-center">
          {!isSidebarOpen && (
            <button 
              className="mr-2 p-2"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <Menu size={20} color='white' />
            </button>
          )}
          <div className="w-10 h-10 bg-[var(--button-color)] rounded-full flex items-center justify-center text-white font-bold mr-3">
            {selectedChat?.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold text-white">{selectedChat?.name}</h2>
            <p className="text-xs text-white">Last seen today at {selectedChat?.time}</p>
          </div>
        </div>
        
        {/* Messages */}
        <div 
          className="flex-1 p-4 overflow-y-auto"
          style={{ 
            backgroundColor: 'black',
            backgroundImage: 'radial-gradient(circle at center, rgba(32, 32, 32, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%)',
            backgroundSize: '100% 100%',
          }}
        >
          <div className="space-y-2">
            {selectedChat?.messages.map(message => (
              <div 
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md rounded-lg p-3 backdrop-blur-md ${
                    message.sender === 'me' 
                      ? 'rounded-tr-none border border-white/20' 
                      : 'rounded-tl-none border border-white/20'
                  }`}
                  style={{ 
                    backgroundColor: message.sender === 'me' ? 'var(--message-outgoing)' : 'var(--message-incoming)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: message.sender === 'me' 
                      ? '0 4px 6px rgba(0, 137, 123, 0.1), 0 1px 3px rgba(0, 137, 123, 0.2), 0 0 0 1px rgba(0, 137, 123, 0.1)' 
                      : '0 4px 6px rgba(255, 255, 255, 0.1), 0 1px 3px rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <p className={`${message.sender === 'me' ? 'text-white' : 'text-white'}`}>
                    {message.text}
                  </p>
                  <p className={`text-xs ${message.sender === 'me' ? 'text-teal-100' : 'text-gray-300'} text-right mt-1`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Message input */}
        <div className="bg-[var(--chat-bg-color)] p-3 ">
          <form onSubmit={handleSendMessage} className="flex items-center">
            <button type="button" className="p-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <input 
              type="text" 
              placeholder="Type a message" 
              className="flex-1 mx-2 p-2 rounded-full focus:outline-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="p-2 bg-[var(--button-color)] text-white rounded-full">
            <SendHorizontal size={22} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppClone;