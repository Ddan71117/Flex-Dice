"use client";
import { useState, useEffect } from 'react';
import DiceCluster from '../components/DiceCluster';
import ChatBox from '../components/ChatBox';
import Stats from '../components/Stats';
import MainDropdown from '../components/MainDropdown';
import Layout from "../layout";
import PokerTable from '../components/gametable'; // Import PokerTable

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
    // <div className="relative min-h-screen bg-transparent">
      <Layout>
        <MainDropdown />
        {/* <PokerTable /> Render PokerTable here */}
       
      <ChatBox />
      <Stats />
      </Layout>
  //   </div>
  );
};

export default GamePage;