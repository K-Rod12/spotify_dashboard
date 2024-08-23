import React from "react";
import PlayIcon from "../assets/PlayIcon"; // Adjust the import path as necessary

interface TrackItemProps {
  key: any;
  track: any;
}

const TrackItem: React.FC<TrackItemProps> = ({ key, track }) => {

  return (
    <div className="flex items-center mb-4 w-full p-2 bg-spotify-grey rounded-lg hover:bg-spotify-grey-hover transition duration-300">
      <img
        src={track.album.images[0]?.url}
        alt={track.name}
        className="w-16 h-16 rounded-lg mr-4"
      />
      <div className="flex flex-col flex-grow">
        <span className="text-sm sm:text-xl font-bold">
          {track.name}
        </span>
        <span className="text-xs sm:text-sm text-gray-400">
          {track.artists.map((artist: any) => artist.name).join(", ")}
        </span>
        <span className="text-xs sm:text-sm text-gray-400">
          {track.album.name}
        </span>
      </div>
      <div className="flex items-center mr-2 sm:mr-8">
        <PlayIcon onClick={() => window.open(track.external_urls.spotify, '_blank')} />
        <span className="text-xs sm:text-sm text-gray-400 w-12 sm:w-16 text-right">
          {Math.floor(track.duration_ms / 60000)}:
          {((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

export default TrackItem;
