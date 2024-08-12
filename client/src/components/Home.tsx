import React, { useState } from "react";
import "../index.css";
import Profile from "../Pages/Profile";
import Navbar from "./Navbar/Navbar";
import TopArtist from "../Pages/Artists";
import TopTracks from "../Pages/Tracks";
import Recent from "../Pages/Recent";
import Recommendations from "../Pages/Recommendations";

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
      case "Recommendations":
        return <Recommendations/>;
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
