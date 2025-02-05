"use client";
import React, { useState, useEffect } from "react";
import Game from "./gameLogic";
import { useSession } from "next-auth/react";

type PokerTableProps = {
  setGameLog: React.Dispatch<React.SetStateAction<string[]>>;
};

const PokerTable: React.FC<PokerTableProps> = ({ setGameLog }) => {
  const { data: session } = useSession();
  const {
    user,
    players,
    handleTurn,
    winner,
    currentPlayerIndex,
    gameState,
    setGameState,
    processResults,
  } = Game(setGameLog);

  const [displayedDice, setDisplayedDice] = useState<string[]>([]);
  const [userAvatar, setUserAvatar] = useState<string>(""); 
  const [playerAvatars, setPlayerAvatars] = useState<{ [key: number]: string }>({}); 

  const availableAvatars = [
    '/images/ahsoka.png',
    '/images/bb8.png',
    '/images/c3po.png',
    '/images/darth_maul.png',
    '/images/orig_yoda.png',
    '/images/red_sith.png',
    '/images/han_solo.png',
    '/images/luke.png',
  ];

  const avatarNames = {
    '/images/ahsoka.png': 'Ahsoka',
    '/images/bb8.png': 'BB8',
    '/images/c3po.png': 'C3PO',
    '/images/darth_maul.png': 'Darth Maul',
    '/images/orig_yoda.png': 'Master Yoda',
    '/images/red_sith.png': 'Sith Lord',
    '/images/han_solo.png': 'Han Solo',
    '/images/luke.png': 'Luke Skywalker',
  };

  const diceImages = {
    L: "/images/dice3.png",
    R: "/images/dice4.png",
    C: "/images/dice2.png",
    "•": "/images/dice1.png",
  };

  // Function to get Avatar Image
  const getAvatarImage = (id: number): string => {
    if (id === 1 && userAvatar) {
      return userAvatar; // Player 1 (logged-in user)
    }
    return playerAvatars[id] || ""; // Return assigned avatar for other players
  };

  // Setup initial avatars for players
  useEffect(() => {
    // Fetch the logged-in user's avatar from localStorage
    const storedAvatar = localStorage.getItem("selectedAvatar");
    if (storedAvatar) {
      setUserAvatar(storedAvatar); // Set logged-in user avatar
    } else {
      setUserAvatar("/images/orig_yoda.png"); // Default avatar for player 1
    }

    // Assign static avatars to other players
    const avatars: { [key: number]: string } = {};
    const avatarSet = new Set(availableAvatars);
    let remainingAvatars = [...availableAvatars];

    // Ensure no duplicate avatars
    players.forEach((player) => {
      if (player.id !== 1 && !avatars[player.id]) {
        // Select a static avatar for non-logged-in players
        const avatar = remainingAvatars[player.id % remainingAvatars.length];
        avatars[player.id] = avatar;
      }
    });

    setPlayerAvatars(avatars);
  }, [session, players]);

  // Function to get chip stack image
  const getChipStackImage = (chips: number): string => {
    if (chips <= 0) return "";
    if (chips <= 2) return "/images/smCoins.png";
    if (chips <= 3) return "/images/mdCoins.png";
    return "/images/lgCoins.png";
  };

  // Start dice animation
  const startDiceAnimation = () => {
    let animationFrames = 0;
    const maxFrames = 30;
    const currentDiceCount = Math.min(players[currentPlayerIndex].chips, 3);
    const animate = () => {
      if (animationFrames >= maxFrames) {
        const results = players[currentPlayerIndex].diceResult || [];
        setDisplayedDice(
          results.map((result) => diceImages[result as keyof typeof diceImages])
        );
        setGameState((prev) => ({
          ...prev,
          isRolling: false,
          isProcessingResults: true,
        }));
        processResults(results, currentPlayerIndex);
        setGameLog((log) => [
          ...log,
          `Player ${players[currentPlayerIndex].id} rolled: ${results.join(" ")}`,
        ]);
        return;
      }
      const randomDice = Array(currentDiceCount)
        .fill(null)
        .map(
          () =>
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

  // Click handler for turning
  const onTurnClick = () => {
    handleTurn();
  };

  const playerPositions = [
    { top: "5%", left: "40%", transform: "-translate-x-1/2" },
    { top: "30%", left: "10%" },
    { top: "70%", left: "10%" },
    { top: "70%", right: "10%" },
    { top: "30%", right: "10%" },
  ];

  const centerPot = players.find((p) => p.id === 0)?.chips || 0;

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
            key={`${player.id}-${index}`} // Combine player.id and index for a unique key
            className={`absolute ${index === currentPlayerIndex && !gameState.isRolling
                ? "border-4 border-yellow-400 p-2 rounded-full animate-pulse ring-4 ring-yellow-500 transition-all duration-500"
                : ""
              }`}
            style={{
              ...playerPositions[index],
              transform: playerPositions[index].transform || "none",
            }}
          >
            <div className="flex flex-col items-center">
              {player.id === 1 ? (
                // 🟢 Differentiate Player 1 (You)
                <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full shadow-lg border-4 border-white">
                   <img
                    src={userAvatar}
                    alt='YOU'
                    width={85}
                    height={85}
                    className="w-16 h-16 rounded-full shadow-lg"
                  />
                </div>
              ) : (
                // 🟡 Other Players (Show Avatar)
                <div className="relative">
                  <img
                    src={getAvatarImage(player.id)}
                    alt={`Player ${avatarNames[getAvatarImage(player.id) as keyof typeof avatarNames]}`}
                    width={85}
                    height={85}
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
                  {player.id === 1 ? "You" : avatarNames[getAvatarImage(player.id) as keyof typeof avatarNames]} : {player.chips} chip{player.chips !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        ))}
        {/* Center pot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            {displayedDice.map((dice, index) => (
              <img
                key={index}
                src={dice}
                alt={`Dice ${index + 1}`}
                className={`w-12 h-12 ${gameState.isRolling ? "animate-bounce" : ""}`}
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
                Center Pot: {centerPot} chip{centerPot !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
        {!winner ? (
          players[currentPlayerIndex].id === parseInt(user.id || "0") &&
          !gameState.isRolling &&
          !gameState.isProcessingResults && (
            <button
              onClick={onTurnClick}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Roll {Math.min(players[currentPlayerIndex].chips, 3)} Dice
            </button>
          )
        ) : (
          <h2 className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xl text-white">
            :tada: Player {winner} wins the game! :tada:
          </h2>
        )}
      </div>
    </div>
  );
};

export default PokerTable;
