"use client";
import { useState, useEffect } from "react";
import DiceCluster from "../components/DiceCluster";
import ChatBox from "../components/ChatBox";
import GameLog from "../components/GameLog";
import MainDropdown from "../components/MainDropdown";

const GamePage: React.FC = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  useEffect(() => {
    console.log("GamePage component mounted");
    return () => {
      console.log("GamePage component unmounted");
    };
  }, []);

  useEffect(() => {
    console.log("selectedAvatar state changed:", selectedAvatar);
  }, [selectedAvatar]);

  useEffect(() => {
    // Retrieve avatar from localStorage on page load
    const storedAvatar = localStorage.getItem("selectedAvatar");
    if (storedAvatar) {
      setSelectedAvatar(storedAvatar);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* game logic here */}
      <ChatBox />
      <GameLog />
      <div className="p-5">
        {" "}
        <MainDropdown />
      </div>
    </div>
  );
};

export default GamePage;
