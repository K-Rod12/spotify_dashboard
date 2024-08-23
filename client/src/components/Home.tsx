import React, { useEffect, useState } from "react";
import "../index.css";
import Profile from "../Pages/Profile";
import Navbar from "./Navbar/Navbar";
import TopArtist from "../Pages/Artists";
import TopTracks from "../Pages/Tracks";
import Recent from "../Pages/Recent";
import Recommendations from "../Pages/Recommendations";
import PromptRecommendations from "../Pages/PromptRecommendations";

const removeStaleLocalStorageItem = (key: string, expiryHours: number) => {
  const item = localStorage.getItem(key);
  const timestamp = localStorage.getItem(`${key}Timestamp`);

  if (item && timestamp) {
    const currentTime = new Date().getTime();
    const storedTime = new Date(parseInt(timestamp, 10)).getTime();
    const timeDifference = currentTime - storedTime;
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference >= expiryHours) {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}Timestamp`);
    }
  }
};


function Home(setAccessToken: any) {
  const [currentPage, setCurrentPage] = useState("Profile");
  
  useEffect(() => {
    // Remove stale items from localStorage
    removeStaleLocalStorageItem("recommendedTracks", 24);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "Profile":
        return <Profile setAccessToken={setAccessToken} setCurrentPage={setCurrentPage}/>;
        case "Artists":
          return <TopArtist/>;
      case "Tracks":
        return <TopTracks/>;
      case "Recent":
        return <Recent/>;
      case "Recommendations":
        return <Recommendations/>;
      case "Generate":
        return <PromptRecommendations/>;
      default:
        return <Profile setAccessToken={setAccessToken} setCurrentPage={setCurrentPage}/>;
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-black text-white">
        <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} />
        {/* Main content */}
        <div className="flex-1 p-8 mt-2">{renderPage()}</div>
      </div>
    </>
  );
}

export default Home;
