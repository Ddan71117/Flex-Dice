'use client';
import { useState, useEffect } from 'react';
import '../globals.css';

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
    { id: 0, chips: 0, diceResult: null }
  ]);

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameLog, setGameLog] = useState<string[]>([]);
  const [winner, setWinner] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    isRolling: false,
    isProcessingResults: false,
    diceCount: 3
  });

  useEffect(() => {
    const activePlayers = players.filter(player => player.id !== 0 && player.chips > 0);
    if (activePlayers.length === 1) {
      setWinner(activePlayers[0].id);
    }
  }, [players]);

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
    setGameLog((log) => [...log, `Player ${player.id} rolled ${rolls.join(', ')}`]);

    setTimeout(() => {
      setGameState(prev => ({ ...prev, isProcessingResults: false }));
      nextTurn();
    }, 1000);
  };

  const handleTurn = () => {
    if (winner !== null || gameState.isRolling) return;

    const player = players[currentPlayerIndex];
    if (player.chips === 0) {
      setGameLog((log) => [...log, `Player ${player.id} is out of chips :(`]);
      nextTurn();
      return;
    }

    // Calculate number of dice based on available chips
    const diceCount = Math.min(player.chips, 3);
    const rolls: string[] = [];
    for (let i = 0; i < diceCount; i++) {
      rolls.push(rollDice());
    }

    setGameState({ 
      isRolling: true, 
      isProcessingResults: false,
      diceCount // Store the number of dice being rolled
    });

    // Store the results but don't process them yet
    const newPlayers = [...players];
    newPlayers[currentPlayerIndex].diceResult = rolls;
    setPlayers(newPlayers);

    return rolls;
  };

  const nextTurn = () => {
    setCurrentPlayerIndex((prev) => {
      let nextIndex = (prev + 1) % players.length;
      while (players[nextIndex].id === 0) {
        nextIndex = (nextIndex + 1) % players.length;
      }
      return nextIndex;
    });
  };

  return {
    players,
    gameLog,
    handleTurn,
    winner,
    currentPlayerIndex,
    gameState,
    setGameState,
    processResults
  };
}