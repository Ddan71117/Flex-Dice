'use client';
import { useState, useEffect } from 'react';
import '../globals.css';

type Player = {
  id: number;
  chips: number;
}

export default function Game() {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, chips: 3 },
    { id: 2, chips: 3 },
    { id: 3, chips: 3 },
    { id: 4, chips: 3 },
    { id: 0, chips: 0 }
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameLog, setGameLog] = useState<string[]>([]);
  const [winner, setWinner] = useState<number | null>(null);

  useEffect(() => {
    const activePlayers = players.filter(player => player.id !== 0 && player.chips > 0);
    if (activePlayers.length === 1) {
      setWinner(activePlayers[0].id);
    }
  }, [players]);

  const rollDice = (): string => {
    const outcomes = ['L', 'R', 'C', '.', '.', '.'];
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  };

  const handleTurn = () => {
    if (winner !== null) return;
    console.log("Before turn:", players.map(player => `Player ${player.id}: ${player.chips} chips`).join(', '));
    const newPlayers = [...players];
    const player = newPlayers[currentPlayerIndex];

    if (player.chips === 0) {
      setGameLog((log) => [...log, `Player ${player.id} is out of chips :(`]);
      nextTurn();
      return;
    }

    const rolls: string[] = [];
    for (let i = 0; i < player.chips && i < 3; i++) {
      rolls.push(rollDice());
    }

    rolls.forEach((roll) => {
      if (roll === 'L') {
        let leftIndex = (currentPlayerIndex - 1 + players.length) % players.length;
        if (newPlayers[leftIndex].id === 0) {
          leftIndex = (leftIndex - 1 + players.length) % players.length;
        }
        newPlayers[leftIndex].chips++;
        player.chips--;
      } else if (roll === 'R') {
        let rightIndex = (currentPlayerIndex + 1) % players.length;
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

    setGameLog((log) => [
      ...log,
      `Player ${player.id} rolled ${rolls.join(', ')}`,
    ]);
    setPlayers(newPlayers);
    console.log("After turn:", newPlayers.map(player => `Player ${player.id}: ${player.chips} chips`).join(', '));
    nextTurn();
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

  // Return the game state as an object
  return { players, gameLog, handleTurn, winner };
}