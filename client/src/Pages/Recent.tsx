import React, { useState, useEffect } from "react";
import { getRecentlyPlayed } from "../requests"; // Ensure this function is defined in your requests file
import TrackItem from "../components/TrackItem";

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
      <h1 className="text-4xl font-bold m-5">Recently Played</h1>
      <div className="w-full">
        {recentTracks.map((track, index) => (
          <TrackItem key={index} track={track.track} />
        ))}
      </div>
    </div>
  );
};

export default Recent;
