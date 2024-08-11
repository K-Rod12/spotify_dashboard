import React, { useState } from "react";
import "../index.css";
import Profile from "./Profile";
import Navbar from "./Navbar/Navbar";
import TopArtist from "./Artists";
import TopTracks from "./Tracks";
import Recent from "./Recent";

function Home(setAccessToken: any) {
  const [currentPage, setCurrentPage] = useState("Profile");

  const renderPage = () => {
    switch (currentPage) {
      case "Profile":
        return <Profile setAccessToken={setAccessToken} />;
        case "Artists":
          return <TopArtist/>;
      case "Tracks":
        return <TopTracks/>;
      case "Recent":
        return <Recent/>;
      case "Playlists":
        return <div>Playlists Page</div>;
      default:
        return <Profile setAccessToken={setAccessToken} />;
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-black text-white">
        <Navbar setCurrentPage={setCurrentPage}/>
        {/* Main content */}
        <div className="flex-1 p-8 mt-2">{renderPage()}</div>
      </div>
    </>
  );
}

export default Home;
