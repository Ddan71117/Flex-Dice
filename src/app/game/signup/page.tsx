import exp from 'constants';
import React from 'react';
import '../../styles/globals.css';

const SignUpPage: React.FC = () => {
  return (

    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex justify-center items-center mt-16">
        <div className="max-w-md w-full p-8 bg-gray-800 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-4">Sign Up</h2>
            <form className="space-y-4">
                <div>
                <label htmlFor="email" className="block text-sm">Email</label>
                <input type="email" id="email" className="w-full p-2 bg-gray-700 rounded-md" />
                </div>
               
                <div>
                <label htmlFor="password" className="block text-sm">Password</label>
                <input type="password" id="password" className="w-full p-2 bg-gray-700 rounded-md" />
                </div>
                <div>
                <button type="submit" className="w-full p-2 bg-blue-500 rounded-md hover:bg-blue-700">Sign Up</button>
                </div>
            </form>
        </div>
        </div>
    </div>
    );

};

export default SignUpPage;