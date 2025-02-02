"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black-500 to-indigo-500">
        {" "}
        <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-md w-full sm:w-96">
          <div className="mb-4">
            <p className="text-white text-center mb-3">
              <strong>Flex-Dice</strong> is a virtual version of the dice game{" "}
              <em>Left, Right, Center</em>.
            </p>
            <p className="text-white text-center">
              Please login or sign up below to play!
            </p>
          </div>
          <div className="mt-4 w-full">
            <Link href="/login">
              <button
                type="button"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button
                type="button"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mt-2"
              >
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </main>
  );
}
