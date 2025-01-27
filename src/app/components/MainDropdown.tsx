"use client";
import { useState, useEffect } from 'react';
import Link from "next/link";
import AvatarCarousel from './AvatarCarousel'; // Import the AvatarCarousel component
import DiceCluster from './DiceCluster';

const MainDropdown: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null); // Store the selected avatar


  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Close the dropdown when clicking outside
  const handleClickOutside = (e: any) => {
    if (!e.target.closest('.dropdown') && !e.target.closest('.avatar-btn')) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Simulate login (for testing)
  const handleLogin = () => {
    setIsLoggedIn(true);
    setSelectedAvatar("/images/darth.jpg"); // Set a default avatar after login
  };

  // Simulate logout (for testing)
  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedAvatar(null); // Clear selected avatar on logout
  };
  return (
    <div className="fixed top-20 left-10 z-40 flex items-center space-x-3">
      <button
        type="button"
        className="avatar-btn flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        onClick={toggleDropdown}
      >
        <span className="sr-only">Open user menu</span>
        {isLoggedIn ? (
          <img
            className="w-32 h-32 rounded-full"
            src={selectedAvatar || "/images/baby_yoda.jpg"}
            alt="User Avatar"
            width={48}
            height={48}
          />
        ) : (
          <DiceCluster />

        )}
      </button>

      {isDropdownOpen && (
        <div className="dropdown absolute left-10 top-16 z-50 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600">
          {isLoggedIn ? (
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900 dark:text-white">UserNameHere</span>
              <span className="block text-sm text-gray-500 truncate dark:text-gray-400">userNameEmail Here</span>
            </div>
          ) : (
            <ul className="py-2">
              <li>
                <Link href="/game/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 dark:text-gray-200 dark:hover:bg-blue-600">
                  Login
                </Link>
              </li>
              <li>
                {/* Redirect to signup page */}
                <Link href="/game/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 dark:text-gray-200 dark:hover:bg-green-600">
                  Signup
                </Link>
              </li>
            </ul>
          )}
          {isLoggedIn && (
            <ul className="py-2">
              <li>
                <button
                  onClick={() => setIsLoggedIn(false)} // Handle logout
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Sign out
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
      {isLoggedIn && !selectedAvatar && (
        <div className="absolute top-16 left-10 mt-2 z-50">
          <AvatarCarousel onSelectAvatar={setSelectedAvatar} />
        </div>
      )}
    </div>
  );
};

export default MainDropdown;
