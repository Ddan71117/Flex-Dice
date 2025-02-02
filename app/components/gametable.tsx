'use client';
import React, { useState, useEffect } from 'react';
import Game from './gameLogic'; // Adjust the path as necessary

const PokerTable: React.FC = () => {
  const { players, gameLog, handleTurn, winner, currentPlayerIndex } = Game();
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | undefined>();
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const [diceResults, setDiceResults] = useState<string[]>(['.', '.', '.']); // Default dice results (3 dice)

  useEffect(() => {
    const storedAvatar = localStorage.getItem("selectedAvatar");
    if (storedAvatar) {
      setCurrentUserAvatar(storedAvatar);
    }
  }, []);

  useEffect(() => {
    setRandomNumber(Math.floor(Math.random() * 5) + 1);
  }, []);

  // Function to get a random avatar for other players
  const getRandomAvatar = (playerId: number): string => {
    return `/images/avatar${randomNumber}.png`; // Adjust the naming convention as necessary
  };

  // Function to get the dice image based on the roll result
  const getDiceImage = (result: string): string | undefined => {
    switch (result) {
      case "L":
        return "/images/dice3.png";  // Ensure these images exist in your public folder
      case "R":
        return "/images/dice4.png";
      case "C":
        return "/images/dice2.png";
      case ".":
        return "/images/dice1.png";
      default:
        return "/images/dice1.png";  // Default to empty dice if no result
    }
  };

  // Function to handle the roll and update the dice result in the center
  const handleNextTurn = () => {
    handleTurn(); // Call the game logic function for next turn
    
    // Safely handle the case where diceResult is null or undefined
    let currentDiceResults: string[] = [];
    
    const diceResult = players[currentPlayerIndex].diceResult;
  
    if (diceResult) {
      // If diceResult is available, split it into an array
      currentDiceResults = diceResult.split(", ");
    } else {
      // If diceResult is null or undefined, provide default results
      currentDiceResults = ['.', '.', '.'];
    }
  
    // Ensure the diceResults array has exactly 3 results
    if (currentDiceResults.length !== 3) {
      currentDiceResults = ['.', '.', '.'];  // Default to 3 dots if the length is incorrect
    }
  
    // Set the dice results
    setDiceResults(currentDiceResults);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="relative flex justify-center items-center">
        {/* Poker Table Image */}
        <img
          src="/images/poker_table.png"
          alt="Poker Table"
          className="w-full max-w-4xl"
        />

        {/* Player Positions */}
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`absolute ${
              index === 0
                ? "top-0 left-1/2 transform -translate-x-1/2"
                : index === 1
                ? "top-1/2 left-0 transform -translate-y-1/2"
                : index === 2
                ? "top-1/2 right-0 transform -translate-y-1/2"
                : index === 3
                ? "bottom-0 left-1/4"
                : index === 4
                ? "bottom-0 right-1/4"
                : ""
            }`}
          >
            {/* Player Avatars */}
            <img
              src={player.id === 0 ? currentUserAvatar : getRandomAvatar(player.id)}
              alt={`Player ${player.id}`}
              className="w-12 h-12 rounded-full"
            />
            <p className="text-white">{player.id === 0 ? "You" : `Player ${player.id}`}: {player.chips} chips</p>
          </div>
        ))}

        {/* Center Player (Center Pot) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img
            src="https://example.com/center-pot-image.png" // Replace with the actual URL for the center pot image
            alt="Center Pot"
            className="w-24 h-24 rounded-full"
          />
        </div>

        {/* Dice Results in the Center (Always Show 3 Dice) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-4">
          {diceResults.map((result, index) => (
            <img
              key={index}
              src={getDiceImage(result)}
              alt={`Dice ${index + 1}`}
              className="w-12 h-12"
            />
          ))}
        </div>

        {/* Game Log and Roll Button */}
        {winner ? (
          <h2 className="text-white absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xl">
            🎉 Player {winner} wins the game! 🎉
          </h2>
        ) : (
          <>
            <button
              onClick={handleNextTurn}  // Updated to call handleNextTurn
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-blue-500 text-white rounded-md"
            >
              Next Turn
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PokerTable;