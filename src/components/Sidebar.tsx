import React from "react";
import { Music, Disc, Clock, Users, PlayCircle, Home, List } from "lucide-react";
import SpotifyLogo from "../assets/spotify-logo";
import NavItem from "./NavItem";

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onLogout: () => void;
}

const Sidebar = ({ currentPage, setCurrentPage, onLogout }: SidebarProps) => {
  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-64 h-screen bg-gray-900 flex flex-col fixed">
        <div className="flex-grow">
          <div className="flex items-center justify-center mb-8 pt-6">
            <SpotifyLogo />
          </div>
          <nav className="flex flex-col">
            <NavItem
              icon={Home}
              label="Profile"
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
            <NavItem
              icon={Disc}
              label="Tracks"
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
            <NavItem
              icon={Music}
              label="Artists"
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
            <NavItem
              icon={Clock}
              label="Recents"
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
            <NavItem
              icon={List}
              label="Playlists"
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </nav>
        </div>

        <div className="p-4">
          <button
            onClick={onLogout}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
