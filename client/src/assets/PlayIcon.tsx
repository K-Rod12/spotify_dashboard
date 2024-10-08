import React from "react";

const PlayIcon = ({onClick}) => (
  <svg
    onClick={onClick}
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    className="transition duration-300 ease-in-out hover:opacity-60 h-10 w-10 sm:h-12 sm:w-12"
  >
    <path
      className="fill-black"
      d="M11 23a1 1 0 0 1-1-1V10a1 1 0 0 1 1.447-.894l12 6a1 1 0 0 1 0 1.788l-12 6A1 1 0 0 1 11 23"
    />
    <path
      // fill="#1DB954"
      className="fill-spotify-green"
      d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m7.447 14.895l-12 6A1 1 0 0 1 10 22V10a1 1 0 0 1 1.447-.894l12 6a1 1 0 0 1 0 1.788"
    />
  </svg>
);

export default PlayIcon;
