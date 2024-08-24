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
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [typingIndex, setTypingIndex] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const typeAndCyclePlaceholders = useCallback(() => {
    const placeholders = [
      "The best music from the 90s",
      "Upbeat songs for a workout",
      "Relaxing jazz for a rainy day",
      "Top hits from 2023",
      "Classic rock anthems"
    ];

    if (isWaiting) return;

    const currentPlaceholder = placeholders[currentPlaceholderIndex];

    if (typingIndex < currentPlaceholder.length) {
      setPlaceholderText(prevText => prevText + currentPlaceholder[typingIndex]);
      setTypingIndex(prevIndex => prevIndex + 1);
    } else if (typingIndex === currentPlaceholder.length) {
      setIsWaiting(true);
      setTimeout(() => {
        setPlaceholderText("");
        setTypingIndex(0);
        setCurrentPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
        setIsWaiting(false);
      }, 3000);
    }
  }, [currentPlaceholderIndex, typingIndex, isWaiting]);

  useEffect(() => {
    const typingInterval = setInterval(typeAndCyclePlaceholders, 100);
    const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 530);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [typeAndCyclePlaceholders]);

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
        <form onSubmit={handleSubmit} className="mb-8 text-center">
          <div className="relative inline-block">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="
                bg-transparent
                border-b-2
                focus:outline-none
                border-spotify-green
                py-4
                px-4
                text-white
                text-center
                w-96
                text-xl
                md:text-2xl
              "
            />
            <span className="absolute text-2xl inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
              {placeholderText}
              <span className={`ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>|</span>
            </span>
          </div>
          <button type="submit" className="ml-4 p-4 bg-spotify-green rounded-lg w-full lg:w-64 mt-8 text-xl font-bold">
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
