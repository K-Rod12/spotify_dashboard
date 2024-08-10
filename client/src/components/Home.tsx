import React, { useState } from "react";
import "../index.css";
import Profile from "./Profile";
import Navbar from "./Navbar/Navbar";
import SpotifyLogo from "../assets/spotify-logo";
import { logout } from "../requests";

function Home(setAccessToken: any) {
  const [currentPage, setCurrentPage] = useState("Profile");

  const renderPage = () => {
    switch (currentPage) {
      case "Profile":
        return <Profile setAccessToken={setAccessToken} />;
      case "Tracks":
        return <div>Tracks Page</div>;
      case "Artists":
        return <div>Artists Page</div>;
      case "Recents":
        return <div>Recents Page</div>;
      case "Playlists":
        return <div>Playlists Page</div>;
      default:
        return <Profile setAccessToken={setAccessToken} />;
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-black text-white">
        <SpotifyLogo className="fixed top-5 left-5" />
        <Navbar setCurrentPage={setCurrentPage} logout={logout} />
        {/* Main content */}
        <div className="flex-1 p-10 overflow-auto mt-5">{renderPage()}</div>
      </div>
    </>
  );
}

export default Home;
