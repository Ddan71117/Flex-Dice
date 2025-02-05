'use client';
import React, { useState, useEffect } from 'react';
import Game from './gameLogic';

const PokerTable: React.FC = () => {
  const {
    players,
    handleTurn,
    winner,
    currentPlayerIndex,
    gameState,
    setGameState,
    processResults
  } = Game();
  
  const [displayedDice, setDisplayedDice] = useState<string[]>([]);

  const diceImages = {
    "L": "/images/dice3.png",
    "R": "/images/dice4.png",
    "C": "/images/dice2.png",
    ".": "/images/dice1.png",
  };

  const getChipStackImage = (chips: number): string => {
    if (chips <= 0) return '';
    if (chips <= 2) return '/images/smCoins.png'; // Low amount
    if (chips <= 3) return '/images/mdCoins.png'; // Medium amount
    return '/images/lgCoins.png'; // High amount
  };

  const startDiceAnimation = () => {
    let animationFrames = 0;
    const maxFrames = 30;
    const currentDiceCount = Math.min(players[currentPlayerIndex].chips, 3);
    
    const animate = () => {
      if (animationFrames >= maxFrames) {
        const results = players[currentPlayerIndex].diceResult || [];
        setDisplayedDice(
          results.map(result => diceImages[result as keyof typeof diceImages])
        );
        setGameState(prev => ({ ...prev, isRolling: false, isProcessingResults: true }));
        processResults(results, currentPlayerIndex);
        return;
      }

      const randomDice = Array(currentDiceCount).fill(null).map(() => 
        diceImages[Object.keys(diceImages)[Math.floor(Math.random() * 4)] as keyof typeof diceImages]
      );
      setDisplayedDice(randomDice);
      animationFrames++;
      
      setTimeout(animate, 100);
    };

    animate();
  };

  useEffect(() => {
    if (gameState.isRolling) {
      startDiceAnimation();
    }
  }, [gameState.isRolling]);

  const onTurnClick = () => {
    handleTurn();
  };

  const playerPositions = [
    { top: '5%', left: '42%', transform: '-translate-x-1/2' },
    { top: '30%', left: '10%' },
    { top: '70%', left: '10%' },
    { top: '70%', right: '10%' },
    { top: '30%', right: '10%' },
  ];

  const getAvatarImage = (id: number): string => {
    if (id === 1) return `/images/avatar1.png`;
    return `https://i.pravatar.cc/100?img=${id + 5}`;
  };

  const centerPot = players.find(p => p.id === 0)?.chips || 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center mt-20">
      <div className="relative w-full max-w-4xl mx-auto mt-16">
        <img 
          src="/images/poker_table.png" 
          alt="Poker Table" 
          className="w-full"
        />

        {players.slice(0, 5).map((player, index) => (
          <div 
            key={player.id} 
            className={`absolute ${
              index === currentPlayerIndex && !gameState.isRolling 
                ? "border-4 border-yellow-400 p-2 rounded-full animate-pulse ring-4 ring-yellow-500 transition-all duration-500" 
                : ""
            }`}
            style={{
              ...playerPositions[index],
              transform: playerPositions[index].transform || 'none',
            }}
          >
            <div className="flex flex-col items-center">
              {player.id === 1 ? (
                // 🟢 Differentiate Player 1 (You) 
                <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full shadow-lg border-4 border-white">
                  YOU
                </div>
              ) : (
                // 🟡 Other Players (Show Avatar)
                <div className="relative">
                  <img 
                    src={getAvatarImage(player.id)} 
                    alt={`Player ${player.id}`} 
                    className="w-16 h-16 rounded-full shadow-lg"
                  />
                </div>
              )}

              {/* 🔵 Chip Stack */}
              {player.chips > 0 && (
                <img 
                  src={getChipStackImage(player.chips)}
                  alt={`${player.chips} chips`}
                  className="absolute -bottom-4 -right-4 w-8 h-8"
                />
              )}

              {/* 🔴 Player Name & Chips */}
              <div className="bg-black bg-opacity-50 px-4 py-2 rounded-full flex items-center space-x-2">
                <p className={`text-center mt-4 ${player.id === 1 ? "text-blue-400 font-bold" : "text-white"}`}>
                  {player.id === 1 ? "You" : `Player ${player.id}`} : {player.chips} chip{player.chips !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            {displayedDice.map((dice, index) => (
              <img 
                key={index} 
                src={dice} 
                alt={`Dice ${index + 1}`} 
                className={`w-12 h-12 ${gameState.isRolling ? 'animate-bounce' : ''}`}
              />
            ))}
          </div>
          {centerPot > 0 && (
            <div className="bg-black bg-opacity-50 px-4 py-2 rounded-full flex items-center space-x-2">
              <img 
                src={getChipStackImage(centerPot)}
                alt={`${centerPot} chips`}
                className="w-6 h-6"
              />
              <p className="text-white font-bold text-lg">
                Center Pot: {centerPot} chip{centerPot !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        {!winner ? (
          players[currentPlayerIndex].id === 1 && !gameState.isRolling && !gameState.isProcessingResults && (
            <button 
              onClick={onTurnClick} 
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Roll {Math.min(players[currentPlayerIndex].chips, 3)} Dice
            </button>
          )
        ) : (
          <h2 className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xl text-white">
            🎉 Player {winner} wins the game! 🎉
          </h2>
        )}
      </div>
    </div>
  );
};

export default PokerTable;