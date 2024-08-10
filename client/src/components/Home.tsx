import React, { useEffect, useState } from "react";
import useAuth from "../utils/Auth";
import "../index.css";
import Profile from "./Profile";
import Login from "./Login";
import Navbar from "./Navbar/Navbar";
import SpotifyLogo from "../assets/spotify-logo";
import { getUser } from "../requests";

function Home({profileData, logout}) {
  const [currentPage, setCurrentPage] = useState("Profile");
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    getUser().then((response) => {
      setUser(response.data);
    });
  }, []);

  const renderPage = (profileData: any, logout: any) => {
    switch (currentPage) {
      case "Profile":
        return <Profile profile={profileData} logout={logout} />;
      case "Tracks":
        return <div>Tracks Page</div>;
      case "Artists":
        return <div>Artists Page</div>;
      case "Recents":
        return <div>Recents Page</div>;
      case "Playlists":
        return <div>Playlists Page</div>;
      default:
        return <Profile profile logout={logout} />;
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-black text-white">
        <SpotifyLogo className="fixed top-5 left-5" />
        <Navbar setCurrentPage={setCurrentPage} logout={logout} />
        {/* Main content */}
        <div className="flex-1 p-10 overflow-auto mt-5">{renderPage(profileData, logout)}</div>
      </div>
    </>
  );
}

export default Home;
