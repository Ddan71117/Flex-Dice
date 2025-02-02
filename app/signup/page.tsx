"use client";

import React, { useState, useEffect } from "react";
import { createUser } from "../lib/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUpPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAnimating, setIsAnimating] = useState(false); // Track animation state
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setIsAnimating(true);
    }, 50);
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      console.log(formData);
      await createUser(undefined, formData);
      setErrorMessage("");
      router.push("/login");
    } catch (error) {
      setErrorMessage("Failed to create user");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black-500 to-indigo-500">
      <div
        className={`bg-gray-800 p-6 rounded-lg shadow-md w-full sm:w-96 transform transition-all duration-500 ${
          isAnimating
            ? "opacity-100 translate-x-0" // Visible and in place after animation
            : "opacity-0 translate-x-20" // Start off-screen to the right
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-white">
          Sign Up
        </h2>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter username"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter password"
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-300">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2 w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm your password"
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                {confirmPasswordVisible ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600"
          >
            Sign Up
          </button>
        </form>
        <p className="text-gray-300 text-sm mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
