'use client';
import React, { useEffect, useState } from 'react';
import Game from './gameLogic'; // Adjust the path as necessary

const PokerTable: React.FC = () => {
  const { players, gameLog, handleTurn, winner } = Game(); // Use Game as a hook
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | undefined>();
  const [ randomNumber, setRandomNumber ]  = useState<number>(0)

  useEffect(() => {
    // Retrieve the current user's avatar from local storage
    const storedAvatar = localStorage.getItem('selectedAvatar');
    if (storedAvatar) {
      setCurrentUserAvatar(storedAvatar);
    }
  }, []);

  useEffect(() => {
    setRandomNumber(Math.floor(Math.random() * 5) + 1);
  }, []);

  // Function to get a random avatar for other players
  const getRandomAvatar = (playerId: number): string => {
    const randomAvatarNumber = randomNumber; // Assuming you have 5 random avatars
    return `/images/avatar${randomAvatarNumber}.png`; // Adjust the naming convention as necessary
  };

  return (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      <img src="/images/poker_table.png" alt="Poker Table" style={{ width: '100%', height: 'auto' }} />
      {players.map((player) => (
        <div key={player.id} style={{ position: 'absolute', /* Positioning logic */ }}>
          <img 
            src={player.id === 0 ? currentUserAvatar : getRandomAvatar(player.id)} 
            alt={`Player ${player.id}`} 
          />
          <p>{player.id === 0 ? 'You' : `Player ${player.id}`}: {player.chips} chips</p>
        </div>
      ))}
      {winner ? (
        <h2>🎉 Player {winner} wins the game! 🎉</h2>
      ) : (
        <button onClick={handleTurn}>Next Turn</button>
      )}
      <h3>Game Log:</h3>
      <ul>
        {gameLog.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
};

export default PokerTable;