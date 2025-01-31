"use client";

import React from "react";
import { useState, useEffect } from "react";
import AvatarCarousel from "./AvatarCarousel";
import { usePathname } from "next/navigation"; // Import usePathname from next/navigation
import MainDropdown from "./MainDropdown";

const Nav: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [avatarSelected, setAvatarSelected] = useState(false); // Track avatar selection
  const pathname = usePathname(); // Get current path

  // Simulate login for testing (you can replace this with your actual authentication logic)
  useEffect(() => {
    // Check if the user is logged in (use session data, cookies, or localStorage in a real app)
    const loggedInUser = false; // Simulate a logged-in state (change to true to test)
    setIsLoggedIn(loggedInUser);
  }, []);

  const isMainPage = pathname === "/"; // Check if it's the main page
  const isLoginPage = pathname === "/login"; // Check if it's the login page
  const isSignupPage = pathname === "/signup"; // Check if it's the signup page

  // Handle avatar selection (this could be done by setting the avatar after signup)
  const handleAvatarSelection = (avatar: string) => {
    console.log("Avatar selected:", avatar);
    setAvatarSelected(true);
    setIsLoggedIn(true); // Simulate manual login after avatar selection
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 p-4 h-19 text-white flex justify-between items-center z-30 ">
      <div className="text-7xl font-semibold text-center ">Flex-Dice</div>
      {/* Show DiceCluster only on the main page '/' if not logged in */}
      {/* {isMainPage && !isLoggedIn && (
        <div className="">
          <MainDropdown />
        </div>
      )} */}

      {/* Show AvatarCarousel only on the login page '/login' */}
      {/* {isLoginPage && !isLoggedIn && (
        <div className="absolute inset-0 flex justify-center items-center">
          <AvatarCarousel onSelectAvatar={handleAvatarSelection} />
        </div>
      )} */}

      {/* On the signup page '/signup', show AvatarCarousel until the avatar is selected */}
      {/* {isSignupPage && !avatarSelected && (
        <div className="absolute inset-0 flex justify-center items-center">
          <AvatarCarousel onSelectAvatar={handleAvatarSelection} />
        </div>
      )} */}
    </nav>
  );
};

export default Nav;
