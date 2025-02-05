'use client';
import { useState, useEffect } from 'react';

type Player = {
  id: number;
  chips: number;
  diceResult: string[] | null;
};

type GameState = {
  isRolling: boolean;
  isProcessingResults: boolean;
  diceCount: number;
};

export default function Game() {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, chips: 3, diceResult: null },
    { id: 2, chips: 3, diceResult: null },
    { id: 3, chips: 3, diceResult: null },
    { id: 4, chips: 3, diceResult: null },
    { id: 5, chips: 3, diceResult: null },
    { id: 0, chips: 0, diceResult: null } // Center pot
  ]);

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [winner, setWinner] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    isRolling: false,
    isProcessingResults: false,
    diceCount: 3
  });

  // Check for winner and distribute center pot
  useEffect(() => {
    if (winner === null) {
      const activePlayers = players.filter(player => player.id !== 0 && player.chips > 0);
      if (activePlayers.length === 1) {
        const winningPlayer = activePlayers[0];
        const centerPot = players.find(p => p.id === 0)?.chips || 0;
        setWinner(winningPlayer.id);
        
        if (centerPot > 0) {
          setPlayers(prevPlayers => 
            prevPlayers.map(player => {
              if (player.id === winningPlayer.id) {
                return { ...player, chips: player.chips + centerPot };
              }
              if (player.id === 0) {
                return { ...player, chips: 0 };
              }
              return player;
            })
          );
        }
      }
    }
  }, [players, winner]);

  useEffect(() => {
    if (!gameState.isRolling && !gameState.isProcessingResults && players[currentPlayerIndex].id !== 1) {
      const timer = setTimeout(() => {
        handleTurn();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPlayerIndex, gameState]);

  const rollDice = (): string => {
    const outcomes = ['L', 'R', 'C', '.', '.', '.'];
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  };

  const processResults = (rolls: string[], playerIndex: number) => {
    const newPlayers = [...players];
    const player = newPlayers[playerIndex];

    rolls.forEach((roll) => {
      if (roll === 'L') {
        let leftIndex = (playerIndex - 1 + players.length) % players.length;
        if (newPlayers[leftIndex].id === 0) {
          leftIndex = (leftIndex - 1 + players.length) % players.length;
        }
        newPlayers[leftIndex].chips++;
        player.chips--;
      } else if (roll === 'R') {
        let rightIndex = (playerIndex + 1) % players.length;
        if (newPlayers[rightIndex].id === 0) {
          rightIndex = (rightIndex + 1) % players.length;
        }
        newPlayers[rightIndex].chips++;
        player.chips--;
      } else if (roll === 'C') {
        newPlayers.find(p => p.id === 0)!.chips++;
        player.chips--;
      }
    });

    setPlayers(newPlayers);

    setTimeout(() => {
      setGameState(prev => ({ ...prev, isProcessingResults: false }));
      nextTurn();
    }, 1000);
  };

  const handleTurn = () => {
    if (winner !== null || gameState.isRolling) return;

    const player = players[currentPlayerIndex];
    if (player.chips === 0) {
      nextTurn();
      return;
    }

    const diceCount = Math.min(player.chips, 3);
    const rolls: string[] = [];
    for (let i = 0; i < diceCount; i++) {
      rolls.push(rollDice());
    }

    setGameState({ 
      isRolling: true, 
      isProcessingResults: false,
      diceCount
    });

    const newPlayers = [...players];
    newPlayers[currentPlayerIndex].diceResult = rolls;
    setPlayers(newPlayers);
  };

  const nextTurn = () => {
    setCurrentPlayerIndex((prev) => {
      let nextIndex = (prev + 1) % players.length;
      while (players[nextIndex].id === 0 || players[nextIndex].chips === 0) {
        nextIndex = (nextIndex + 1) % players.length;
      }
      return nextIndex;
    });
  };

  return {
    players,
    handleTurn,
    winner,
    currentPlayerIndex,
    gameState,
    setGameState,
    processResults
  };
}