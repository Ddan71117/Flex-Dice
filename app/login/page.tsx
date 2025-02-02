"use client";

import { useActionState, useEffect, useState } from "react";
import { authenticate } from "../lib/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setIsAnimating(true);
    }, 50);
  }, []);

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
        <form action={formAction}>
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
              required
              minLength={1}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300">
              Password
            </label>
            <input
              className="mt-2 w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              required
              minLength={6}
            />
          </div>
          <button
            className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600"
            aria-disabled={isPending}
          >
            Log In
          </button>
          <p className="text-gray-300 text-sm mt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-500">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
