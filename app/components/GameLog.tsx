"use client";

import { useState, useEffect } from "react";

export default function GameLog() {
  const [winnings, setWinnings] = useState(0);
  const [losses, setLosses] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [userName, setUserName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulating game stats for demonstration
  useEffect(() => {
    // Here you can replace this with real data or fetch it from your state/store
    setWinnings(10);
    setLosses(5);
    setGamesPlayed(15);
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <button
        onClick={openModal}
        className="fixed bottom-4 right-4 h-14 px-6 m-2 text-lg text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
      >
        View Your Stats
      </button>

      {isModalOpen && (
        <div className="fixed bottom-4 right-4 bg-white p-6 rounded-lg w-80 sm:w-96 max-w-sm mx-auto shadow-lg z-50">
          {/* Adjusting padding to remove excessive margins */}
          <div className="bg-white p-4 rounded-lg w-full max-w-xs sm:max-w-sm mx-auto text-left">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
              {userName} Stats
            </h3>

            <div className="flex justify-between text-black text-md mb-2">
              <span>Winnings:</span>
              <span>{winnings}</span>
            </div>
            <div className="flex justify-between text-black text-md mb-2">
              <span>Losses:</span>
              <span>{losses}</span>
            </div>
            <div className="flex justify-between text-black text-md mb-2">
              <span>Games Played:</span>
              <span>{gamesPlayed}</span>
            </div>

            {/* Close Button */}
            <button
              className="mt-4 bg-red-500 text-white p-2 rounded-lg"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
