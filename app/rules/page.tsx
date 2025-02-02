"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const Rules = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="overflow-hidden p-8 rounded-xl shadow-xl max-w-4xl">
        <h5 className="mb-6 text-3xl font-semibold text-center text-gray-900">
          How to Play
        </h5>
        <div className="flex space-x-8">
          <div className="flex-1 space-y-4">
            {/* Left content */}
            <p className="text-lg text-gray-700">
              Each player receives 3 chips.
            </p>
            <ul className="list-disc pl-6 text-lg text-gray-700 font-medium space-y-2">
              <li>
                Choose a player to start. This player takes their turn by
                rolling the dice.
              </li>
              <li>If you have 3 or more chips, roll all 3 dice.</li>
              <li>If you have 2 chips, roll 2 dice.</li>
              <li>If you have 1 chip, roll 1 die.</li>
              <li>If you have no chips, don’t roll any dice.</li>
            </ul>
            <p className="text-lg text-gray-700">
              After rolling the dice, the player takes action depending on the
              dice rolled.
            </p>
            <ul className="list-disc pl-6 text-lg text-gray-700 font-medium space-y-2">
              <li>Rolling an L: Pass a chip to the player on your left.</li>
              <li>Rolling an R: Pass a chip to the player on your right.</li>
              <li>Rolling a C: Put a chip in the center pot.</li>
              <li>Rolling a D: Do nothing.</li>
            </ul>
          </div>

          <div className="flex-1 space-y-4">
            {/* Right content */}
            <p className="text-lg text-gray-700">
              If you lose all your chips, you aren't out of the game but you
              don’t roll any dice until another player passes you a chip.
            </p>
            <p className="text-lg text-gray-700">
              <strong>Winning the Game:</strong>
            </p>
            <p className="text-lg text-gray-700">
              The game ends when only one player has chips left. That player is
              the winner and gets to take all the chips from the center pot!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rules;
