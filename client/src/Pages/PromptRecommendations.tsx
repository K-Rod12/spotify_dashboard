import React, { useState, useEffect, useCallback } from "react";
import { getSongsFromPrompt } from "../requests";
import TrackItem from "../components/TrackItem";
import CreatePlaylistModal from "../components/CreatePlaylistModal";

const PromptRecommendations = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedTracks, setGeneratedTracks] = useState<any[]>([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackUris, setTrackUris] = useState<string[]>([]);
  const [placeholderText, setPlaceholderText] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [typingIndex, setTypingIndex] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  useEffect(() => {
    const savedTracks = sessionStorage.getItem('generatedTracks');
    if (savedTracks) {
      const parsedTracks = JSON.parse(savedTracks);
      setGeneratedTracks(parsedTracks);
      setTrackUris(parsedTracks.map((track: any) => track.uri));
      setPlaylistName(sessionStorage.getItem('playlistName') || '');
      setPlaylistDescription(sessionStorage.getItem('playlistDescription') || '');
    }
  }, []);

  const typeAndCyclePlaceholders = useCallback(() => {
    const placeholders = [
      "The best music from the 90s",
      "Upbeat songs for a workout",
      "Relaxing jazz for a rainy day",
      "Top hits from 2023",
      "Classic rock anthems",
    ];

    if (isWaiting || prompt !== "" || isFocused) return;

    const currentPlaceholder = placeholders[currentPlaceholderIndex];

    if (typingIndex < currentPlaceholder.length) {
      setPlaceholderText(
        (prevText) => prevText + currentPlaceholder[typingIndex]
      );
      setTypingIndex((prevIndex) => prevIndex + 1);
    } else if (typingIndex === currentPlaceholder.length) {
      setIsWaiting(true);
      setTimeout(() => {
        setPlaceholderText("");
        setTypingIndex(0);
        setCurrentPlaceholderIndex(
          (prevIndex) => (prevIndex + 1) % placeholders.length
        );
        setIsWaiting(false);
      }, 3000);
    }
  }, [currentPlaceholderIndex, typingIndex, isWaiting, prompt, isFocused]);

  useEffect(() => {
    const typingInterval = setInterval(typeAndCyclePlaceholders, 100);
    const cursorInterval = setInterval(
      () => setShowCursor((prev) => !prev),
      530
    );

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
    setIsButtonLoading(true);
    try {
      const response = await getSongsFromPrompt(prompt);
      setPlaylistName(response.playlistName);
      setPlaylistDescription(response.playlistDescription);
      setGeneratedTracks(response.tracks);
      setTrackUris(response.tracks.map((track: any) => track.uri));
      
      // Save to session storage
      sessionStorage.setItem('generatedTracks', JSON.stringify(response.tracks));
      sessionStorage.setItem('playlistName', response.playlistName);
      sessionStorage.setItem('playlistDescription', response.playlistDescription);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setIsButtonLoading(false);
    }
  };

  return (
    <div className="text-white lg:p-1 pt-8 flex flex-col items-center justify-center h-full">
      <form onSubmit={handleSubmit} className="my-8 text-center">
        <div className="w-full lg:w-max text-center relative inline-block">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => {
              setPlaceholderText("");
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
            className="
              bg-transparent
              border-b-2
              focus:outline-none
              border-spotify-green
              py-6
              text-white
              w-full
              lg:w-[32rem]
              text-xl
              md:text-2xl
              text-center
            "
          />
          {prompt === "" && !isFocused && (
            <span className="absolute w-full text-2xl inset-y-0 left-0 flex items-center justify-center pointer-events-none text-gray-500">
              {placeholderText}
              <span
                className={`ml-1 ${
                  showCursor ? "opacity-100" : "opacity-0"
                } transition-opacity duration-100`}
              >
                |
              </span>
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isButtonLoading}
          className={`
            lg:ml-4 p-4 
            ${
              isButtonLoading
                ? "bg-spotify-green-dark"
                : "bg-spotify-green hover:bg-spotify-green-dark"
            }
            transition-all duration-300 ease-in-out 
            rounded-lg w-full lg:w-64 mt-8 
            text-xl font-bold 
            relative overflow-hidden 
            group
            transform hover:scale-105
          `}
        >
          <span className="relative z-10">
            {isButtonLoading ? "Generating..." : "Generate"}
          </span>
          {!isButtonLoading && (
            <div
              className="
              absolute inset-0 
              bg-gradient-to-r from-transparent via-white to-transparent 
              opacity-0 group-hover:opacity-30 
              -skew-x-12
              animate-shimmer
            "
            ></div>
          )}
          {isButtonLoading && (
            <div
              className="
                absolute inset-0 
                bg-gradient-to-r from-spotify-green-light via-spotify-green to-spotify-green-darker
                -skew-x-12
                animate-loading-shimmer
              "
            ></div>
          )}
        </button>
      </form>
      {generatedTracks.length > 0 ? (
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
          <div className="flex flex-col items-center w-full lg:w-4/5">
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
          <p className="text-2xl lg:text-4xl text-center text-gray-500">
            Enter a prompt to generate your playlist
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptRecommendations;