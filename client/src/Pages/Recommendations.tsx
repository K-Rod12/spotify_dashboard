import React, { useState, useEffect } from "react";
import { getTopTracks, getRecommendations } from "../requests"; // Ensure these functions are defined in your requests file
import TrackItem from "../components/TrackItem"; // Ensure this component is defined in your components folder
import CreatePlaylistModal from "../components/CreatePlaylistModal"; // Ensure this component is defined in your components folder

const Recommendations = () => {
  const [recommendedTracks, setRecommendedTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackUris, setTrackUris] = useState<string[]>([]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Fetch user's top tracks
        const topTracksResponse = await getTopTracks("short_term");
        const topTracks = topTracksResponse.data.items.slice(0, 5); // Get the top 5 tracks

        // Get track IDs to use as seed tracks
        const seedTracks = topTracks.map((track: any) => track.id);

        // Fetch recommendations based on the top 5 tracks
        const recommendationsResponse = await getRecommendations(seedTracks);
        setRecommendedTracks(recommendationsResponse.data.tracks);

        const uris = recommendationsResponse.data.tracks.map((track: any) => track.uri).join(",");
        setTrackUris(uris);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pb-40">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="text-white p-1 pt-10 flex flex-col items-center min-h-screen">
      <h1 className="text-4xl m-4 font-bold">Recommended for You</h1>
      <div className="flex mb-5">
        <span
          className={`text-gray-500 hover:text-spotify-green cursor-pointer`}
          onClick={() => handleOpenModal()}
        >
          Save as Playlist
        </span>{" "}
      </div>
      <div className="w-full">
        {recommendedTracks.map((track, index) => (
          <TrackItem key={index} track={track} />
        ))}
      </div>
      <CreatePlaylistModal isOpen={isModalOpen} onClose={handleCloseModal} trackUris={trackUris} />
    </div>
  );
};

export default Recommendations;
