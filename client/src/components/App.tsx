import React, { useEffect, useState } from "react";
import useAuth from "../utils/Auth";
import "../index.css"; // or './App.css' depending on your file name
import Profile from "./Profile";
import Login from "./Login";
import Navbar from "./Navbar/Navbar";
import SpotifyLogo from "../assets/spotify-logo";
import Home from "./Home";
import { token } from '../requests';

function App() {
  const { profileData, isLoggedIn, login, logout } = useAuth();
  const [accessToken, setAccessToken] = useState('');
  const [currentPage, setCurrentPage] = useState("Profile");

  useEffect(() => {
    setAccessToken(token);
  }, []);

  return (
    <>
      {accessToken ? (
        <Home profileData={profileData} logout={logout} />
      ) : (
        <Login profile={profileData} login={login} />
      )}
    </>
  );
}

export default App;
