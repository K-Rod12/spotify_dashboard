import React, { useState, useEffect } from "react";
import { getUser, createPlaylist, addTracksToPlaylist } from "../requests"; // Ensure these functions are defined in your requests file
import { X } from "lucide-react";

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackUris: string[];
  name?: string;
  description?: string;
}

const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  trackUris,
  name = "",
  description = ""
}) => {
  const [userId, setUserId] = useState("");
  const [playlistName, setPlaylistName] = useState(name);
  const [playlistDescription, setPlaylistDescription] = useState(description);
  const [playlistId, setPlaylistId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Fetch the user's ID
    const fetchUserId = async () => {
      try {
        const response = await getUser();
        setUserId(response.data.id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    // Update the state when the props change
    setPlaylistName(name);
    setPlaylistDescription(description);
  }, [name, description]);

  const handleCreatePlaylist = async () => {
    setIsLoading(true);
    try {
      const response = await createPlaylist(
        userId,
        playlistName,
        playlistDescription
      );
      setPlaylistId(response.data.id);
      await handleAddTracks(response.data.id);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error creating playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTracks = async (newPlaylistId: any) => {
    try {
      const response = await addTracksToPlaylist(newPlaylistId, trackUris);
      console.log("Tracks added:", response.data);
    } catch (error) {
      console.error("Error adding tracks:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-spotify-grey p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button>
          <X
            onClick={() => {
              onClose();
              setIsSuccess(false);
            }}
            className="absolute right-0 top-0 m-4"
          />
        </button>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : isSuccess ? (
          <div className="flex flex-col items-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <p className="mb-4">Playlist created successfully!</p>
            <a
              href={`https://open.spotify.com/playlist/${playlistId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Open Playlist
            </a>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Create Playlist</h2>
            <input
              type="text"
              placeholder="Playlist Name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-spotify-grey-hover text-white"
            />
            <textarea
              placeholder="Playlist Description"
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-spotify-grey-hover text-white"
            />
            <button
              onClick={handleCreatePlaylist}
              className="w-full mb-4 p-2 rounded bg-green-500 hover:bg-green-600 transition duration-300"
            >
              Create Playlist
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
