"use client";
import { useState } from 'react';
import AvatarCarousel from '../../components/AvatarCarousel';
import Link from 'next/link'; // Import Link from Next.js

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null); // Track selected avatar

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the form from submitting and reloading the page

        // Basic validation (you can replace this with actual authentication logic)
        if (username === 'testuser' && password === 'password123') {
            setErrorMessage('');
            setIsLoggedIn(true); // Set login status to true, so the Avatar Carousel shows
        } else {
            setErrorMessage('Invalid username or password');
        }
    };

    const handleAvatarSelection = (avatar: string) => {
        setSelectedAvatar(avatar); // Set the selected avatar
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black-500 to-indigo-500">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full sm:w-96">
                {!isLoggedIn ? (
                    <>
                        <h2 className="text-2xl font-semibold mb-4 text-white">Login</h2>

                        {errorMessage && (
                            <div className="text-red-500 text-sm mb-4">
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <label htmlFor="username" className="block text-gray-300">Username</label>
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
                                <label htmlFor="password" className="block text-gray-300">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-2 w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                            >
                                Log In
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-col items-center">
                        <h2 className="text-2xl font-semibold mb-4 text-white">Welcome!</h2>
                        <p className="mb-4 text-gray-400">You are successfully logged in!</p>

                        <h3 className="text-xl text-white mb-4">Select Your Avatar to begin the game</h3>
                        
                        {/* Avatar Carousel after login */}
                        <AvatarCarousel onSelectAvatar={handleAvatarSelection} /> 

                        {/* Check if an avatar has been selected, if so, show a button to go to the game page */}
                        {selectedAvatar && (
                           <Link href={`/game?avatar=${selectedAvatar}`}>
                                <button className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
                                    Start Game
                                </button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
