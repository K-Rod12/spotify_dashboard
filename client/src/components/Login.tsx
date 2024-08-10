import React from 'react';
import "../App.css";
import '../index.css';  // or './App.css' depending on your file name
import { Music2 } from 'lucide-react';

const LOGIN_URI =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:8888/login'
    : 'https://us-central1-kenley-spotify-proj.cloudfunctions.net/app/login';

const Login = ({
  login,
}: {
  profile: any;
  login: () => void;
}) => {
  const handleLogin = () => {
    window.location.href = LOGIN_URI;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white p-8">
      <div className="w-full max-w-md">
        <main className="bg-gradient-to-b from-gray-900 to-black rounded-lg p-8 flex flex-col items-center">
          <div className="mb-8">
            <Music2 size={48} className="text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-center mb-8">Log in to Spotify</h1>
          
          <button
            // href={LOGIN_URI}
            onClick={handleLogin}
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-4 rounded-full transition duration-300"
          >
            Log In
          </button>
        </main>
      </div>
    </div>
  );
};

export default Login;
