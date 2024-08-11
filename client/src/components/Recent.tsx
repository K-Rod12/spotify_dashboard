import React, { useState, useEffect } from "react";
import { getRecentlyPlayed } from "../requests"; // Ensure this function is defined in your requests file
import PlayIcon from "../assets/PlayIcon";

const Recent = () => {
  const [recentTracks, setRecentTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTracks = async () => {
      try {
        const response = await getRecentlyPlayed();
        setRecentTracks(response.data.items); // Set recently played tracks
      } catch (error) {
        console.error("Error fetching recently played tracks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTracks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pb-40">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="text-white p-1 pt-8 flex flex-col items-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Recently Played</h1>
      <div className="w-full">
        {recentTracks.map((track, index) => (
          <div className="flex items-center mb-4 p-2 bg-spotify-grey rounded-lg hover:bg-spotify-grey-hover transition duration-300">
            <img
              src={track.track.album.images[0]?.url}
              alt={track.track.name}
              className="w-16 h-16 rounded-lg mr-4"
            />
            <div className="flex flex-col flex-grow">
              <span className="text-sm sm:text-xl font-bold">
                {track.track.name}
              </span>
              <span className="text-xs sm:text-sm text-gray-400">
                {track.track.artists
                  .map((artist: any) => artist.name)
                  .join(", ")}
              </span>
              <span className="text-xs sm:text-sm text-gray-400">
                {track.track.album.name}
              </span>
            </div>
            <div className="flex items-center mr-2 sm:mr-8">
              <PlayIcon onClick={() => window.open(track.track.external_urls.spotify, '_blank')}/>
              <span className="text-xs sm:text-sm text-gray-400 w-12 sm:w-16 text-right">
                {Math.floor(track.track.duration_ms / 60000)}:
                {((track.track.duration_ms % 60000) / 1000)
                  .toFixed(0)
                  .padStart(2, "0")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recent;
