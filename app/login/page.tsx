"use client";


import { useActionState } from 'react';
import { authenticate } from '../lib/actions'
const LoginPage: React.FC = () => {
  const [errorMessage, formAction, isPending ] = useActionState(
    authenticate,
    undefined
  );

  return (
    
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black-500 to-indigo-500">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full sm:w-96">
              <h2 className="text-2xl font-semibold mb-4 text-white">Login</h2>
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
                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700" aria-disabled={isPending}
                >
                  Log In
                </button>
              </form>
        
        </div>
      </div>
  );
};

export default LoginPage;

