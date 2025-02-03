"use client";

import React from "react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"; // Import usePathname and useRouter from next/navigation
import Link from "next/link"; // Import Link from next/link
import RulesRef from "./Rulesref";
import { serverSignOut } from "../lib/actions";

const Nav: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [avatarSelected, setAvatarSelected] = useState(false); // Track avatar selection
  const pathname = usePathname(); // Get current path
  const router = useRouter(); // Initialize useRouter
  const [showRules, setShowRules] = useState(false); // Track hover state

  // Simulate login for testing (you can replace this with your actual authentication logic)
  useEffect(() => {
    // Check if the user is logged in (use session data, cookies, or localStorage in a real app)
    const loggedInUser = false; // Simulate a logged-in state (change to true to test)
    setIsLoggedIn(loggedInUser);
  }, []);

  const isMainPage = pathname === "/"; // Check if it's the main page
  const isLoginPage = pathname === "/login"; // Check if it's the login page
  const isSignupPage = pathname === "/signup"; // Check if it's the signup page
  const isGamePage = pathname === "/gamepage"; // Check if it's the game page
  const isRules = pathname === "/rules"; // Check if it's the rules page

  // Handle avatar selection (this could be done by setting the avatar after signup)
  const handleAvatarSelection = (avatar: string) => {
    setAvatarSelected(true);
    setIsLoggedIn(true); // Simulate manual login after avatar selection
  };

  const handleSignOut = async () => {
    await serverSignOut();
    router.push("/");
  };

  return (
    <nav className="fixed w-full bg-gray-gradient bg-[length:400%_400%] animate-gradient mt-10 text-white flex justify-between items-center z-30">
      <div className="text-5xl p-4 font-semibold" style={{ marginLeft: "17%" }}>
        Flex-Dice
      </div>
      <div className="p-4" style={{ marginRight: "17%" }}>
        {isGamePage && ( // Only show the button on the game page
          <div
            onMouseEnter={() => setShowRules(true)}
            onMouseLeave={() => setShowRules(false)}
            className="relative"
          >
            <button
              type="button"
              className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600"
            >
              Rules
            </button>
            <div
              className={`absolute left-1/2 transform -translate-x-1/2 mt-2 transition-all duration-300 ease-in-out overflow-hidden ${
                showRules ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {showRules && <RulesRef />}
            </div>
          </div>
        )}
        {isRules && ( // Only show the button on the rules page
          <div className="flex space-x-4">
            <Link href="/gamepage">
              <button
                type="button"
                className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600"
              >
                Start Game
              </button>
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600"
            >
              Sign out
            </button>
          </div>
        )}
        {!isRules && (
          <form action={serverSignOut}>
            <button className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600">
              Sign out
            </button>
          </form>
        )}
      </div>
    </nav>
  );
};

export default Nav;
