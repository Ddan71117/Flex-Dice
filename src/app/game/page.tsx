"use client";
import { useState, useEffect } from 'react';
import DiceCluster from '../components/DiceCluster';
import ChatBox from '../components/ChatBox';
import Stats from '../components/Stats';
import MainDropdown from '../components/MainDropdown';


const GamePage: React.FC = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
 

  useEffect(() => {
    // Retrieve avatar from localStorage on page load
    const storedAvatar = localStorage.getItem('selectedAvatar');
    if (storedAvatar) {
      setSelectedAvatar(storedAvatar);
    }
  }, []);

 
  return (
    <div className="relative min-h-screen bg-transparent">
     {/* game logic here */ }
   <ChatBox />
   <Stats />
   <MainDropdown />
    </div>
  );
};


export default GamePage;
