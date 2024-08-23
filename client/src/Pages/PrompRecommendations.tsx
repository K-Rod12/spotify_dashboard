import React, { useState } from "react";
import {
  getSongsFromPrompt,
} from "../requests";
import TrackItem from "../components/TrackItem";
import CreatePlaylistModal from "../components/CreatePlaylistModal";

const PromptRecommendations = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedTracks, setGeneratedTracks] = useState<any[]>([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackUris, setTrackUris] = useState<string[]>([]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await getSongsFromPrompt(prompt);
      setPlaylistName(response.playlistName);
      setPlaylistDescription(response.playlistDescription);
      setGeneratedTracks(response.tracks);
      setTrackUris(response.tracks.map((track: any) => track.uri));
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleCreatePlaylist = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await createPlaylist(
  //       userId,
  //       playlistName,
  //       playlistDescription
  //     );
  //     setPlaylistId(response.data.id);
  //     await handleAddTracks(response.data.id);
  //     setIsSuccess(true);
  //   } catch (error) {
  //     console.error("Error creating playlist:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleAddTracks = async (newPlaylistId: any) => {
  //   try {
  //     const response = await addTracksToPlaylist(newPlaylistId, trackUris);
  //     console.log("Tracks added:", response.data);
  //   } catch (error) {
  //     console.error("Error adding tracks:", error);
  //   }
  // };

  return (
    <div className="text-white p-1 pt-10 flex flex-col items-center min-h-screen">
      <h1 className="text-4xl m-4 font-bold">Generate Song Recommendations</h1>
      <form onSubmit={handleSubmit} className="mb-5">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt"
          className="
            bg-transparent
            border-b
            focus:outline-none
            border-spotify-green
            py-2
            px-2
            text-white
            placeholder-gray-500
          "
        />
        <button type="submit" className="ml-2 p-2 bg-spotify-green rounded-lg">
          Generate
        </button>
      </form>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen pb-40">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          {playlistName && playlistDescription && (
            <div className="mb-5 text-center">
              <h2 className="text-2xl font-bold">{playlistName}</h2>
              <p className="text-gray-400">{playlistDescription}</p>
            </div>
          )}
          <div className="flex mb-5">
            {generatedTracks && generatedTracks.length > 0 && (
              <span
                className="text-gray-500 hover:text-spotify-green cursor-pointer"
                onClick={handleOpenModal}
              >
                Save as Playlist
              </span>
            )}
          </div>
          <div className="w-full">
            {generatedTracks.map((track, index) => (
              <TrackItem key={index} track={track} />
            ))}
          </div>
          <CreatePlaylistModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            trackUris={trackUris}
            name={playlistName}
            description={playlistDescription}
          />
        </>
      )}
    </div>
  );
};

export default PromptRecommendations;
