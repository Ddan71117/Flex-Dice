"use client";
import { useState, useEffect } from 'react';
import DiceCluster from '../components/DiceCluster';

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
      <h1 className="text-3xl font-bold text-white">Game Page</h1>

      {/* Add custom container styles for the avatar */}
      <div className="avatar-container flex items-center justify-center">
        {selectedAvatar ? (
          <img
            src={selectedAvatar}
            alt="User Avatar"
            className="w-32 h-32 rounded-full"
          />
        ) : (
          <DiceCluster /> // Show DiceCluster only if no avatar is selected
        )}
      </div>
    </div>
  );
};


export default GamePage;
