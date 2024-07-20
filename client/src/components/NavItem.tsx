import React from "react";

const NavItem = ({ icon: Icon, label, setCurrentPage, currentPage }: { icon: any; label: string, setCurrentPage?: (page: string) => void, currentPage?: string }) => (
  <button
    onClick={() => setCurrentPage && setCurrentPage(label)}
    className={`flex items-center space-x-2 py-6 px-4 w-full hover:bg-gray-800 transition-colors ${
      currentPage === label ? "bg-gray-800 text-green-500" : "text-gray-300"
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

export default NavItem;
