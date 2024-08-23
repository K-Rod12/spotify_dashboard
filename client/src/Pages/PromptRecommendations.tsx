import React, { useState, useEffect, useCallback } from "react";
import { getSongsFromPrompt } from "../requests";
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
  const [placeholderText, setPlaceholderText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const fullPlaceholder = "The best music from the 90s";

  const typeNextCharacter = useCallback(() => {
    if (placeholderIndex < fullPlaceholder.length) {
      setPlaceholderText(prevText => prevText + fullPlaceholder[placeholderIndex]);
      setPlaceholderIndex(prevIndex => prevIndex + 1);
    }
  }, [placeholderIndex, fullPlaceholder]);

  useEffect(() => {
    const typingInterval = setInterval(typeNextCharacter, 100);

    return () => clearInterval(typingInterval);
  }, [typeNextCharacter]);

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

  return (
    <div className="text-white p-1 pt-8 flex flex-col flex-grow items-center justify-center h-full min-w-screen">
      <div className="flex-2 flex justify-center w-full pt-16">
        <form onSubmit={handleSubmit} className="mb-5 text-center">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholderText}
            className="
              bg-transparent
              border-b
              focus:outline-none
              border-spotify-green
              py-2
              px-2
              text-white
              text-center
              placeholder-gray-500
              w-64
            "
          />
          <button type="submit" className="ml-2 p-2 bg-spotify-green rounded-lg w-full lg:w-normal mt-5">
            Generate
          </button>
        </form>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : generatedTracks.length > 0 ? (
        <>
          {playlistName && playlistDescription && (
            <div className="my-5 text-center">
              <h2 className="text-2xl font-bold">{playlistName}</h2>
              <p className="text-gray-400">{playlistDescription}</p>
            </div>
          )}
          <div className="flex mb-5">
            <span
              className="text-gray-500 hover:text-spotify-green cursor-pointer"
              onClick={handleOpenModal}
            >
              Save as Playlist
            </span>
          </div>
          <div className="w-full lg:w-4/5">
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
      ) : (
        <div className="flex-3 flex items-center justify-center">
          <p className="text-2xl lg:text-4xl text-center text-gray-500">Enter a prompt to generate your playlist</p>
        </div>
      )}
    </div>
  );
};

export default PromptRecommendations;