import { useState } from "react";
import useAuth from "../utils/Auth";
import "../index.css"; // or './App.css' depending on your file name
import Profile from "./Profile";
import Login from "./Login";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar/Navbar";
function App() {
  const { profileData, isLoggedIn, login, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState("Profile");

  const renderPage = () => {
    switch (currentPage) {
      case "Profile":
        return <Profile profile={profileData} onLogout={logout} />;
      case "Tracks":
        return <div>Tracks Page</div>;
      case "Artists":
        return <div>Artists Page</div>;
      case "Recents":
        return <div>Recents Page</div>;
      case "Playlists":
        return <div>Playlists Page</div>;
      default:
        return <Profile profile={profileData} onLogout={logout} />;
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <div className="flex min-h-screen bg-black text-white">

            <Navbar setCurrentPage={setCurrentPage} logout={logout} />
            {/* Main content */}
            <div className="flex-1 p-10 overflow-auto mt-5">{renderPage()}</div>
          </div>
        </>
      ) : (
        <Login profile={profileData} login={login} />
      )}
    </>
  );
}

export default App;
