"use client";

import { useState, useEffect } from "react";
import { authenticate } from "../lib/actions";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setIsAnimating(true);
    }, 50);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMessage("");

    try {
      await authenticate(username, password);
      localStorage.setItem("username", username); // Store username in local storage
      router.push("/game");
    } catch (error) {
      setErrorMessage(
        "Failed to log in. Please check your username or password."
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black-500 to-indigo-500">
      <div
        className={`bg-gray-800 p-6 rounded-lg shadow-md w-full sm:w-96 transform transition-all duration-500 ${
          isAnimating ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
        }`}
      >
        <h2 className="text-2xl font-semibold text-center mb-4 text-white">
          Login
        </h2>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-300">
              Username
            </label>
            <input
              className="mt-2 w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                className="mt-2 w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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

          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600"
            disabled={isPending}
          >
            {isPending ? "Logging In..." : "Log In"}
          </button>

          <p className="text-gray-300 text-sm mt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
