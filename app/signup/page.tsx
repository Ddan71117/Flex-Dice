"use client";

import React, { useState } from "react";
import Layout from "../layout";
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
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      console.log(formData)
      await createUser(undefined, formData);
      setErrorMessage("")
      router.push("/login");
    } catch (error) {
      setErrorMessage("Failed to create user")
      console.log(error)
    }
  }    

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black-500 to-indigo-500">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full sm:w-96">
          <h2 className="text-2xl font-semibold mb-4 text-white">Sign Up</h2>

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
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
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
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Sign Up
            </button>
            <p className="text-gray-300 text-sm mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SignUpPage;
