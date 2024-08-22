import React, { useState, useEffect, useCallback } from "react";
import { Music, Disc, Clock, PlayCircle, Github } from "lucide-react";
import {
  getUser,
  getUserArtists,
  getUserTracks,
  getUserFollowingArtists,
  getUserRecentlyPlay,
  getTopTracks,
  getRecommendations,
  logout as logoutRequest,
} from "../requests";
import ProfileSection from "../components/ProfileSection";

const Profile = ({
  setAccessToken,
  setCurrentPage,
}: {
  setAccessToken: any;
  setCurrentPage: any;
}) => {
  const [artists, setArtists] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [user, setUser] = useState<any>({});
  const [following, setFollowing] = useState<any>({});
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const [recommendedTracks, setRecommendedTracks] = useState<any[]>(() => {
    const storedTracks = localStorage.getItem("recommendedTracks");
    return storedTracks ? JSON.parse(storedTracks) : [];
  });
  const [loading, setLoading] = useState(true); // Loading state

  const logout = useCallback(() => {
    console.log("Logging out...");
    logoutRequest();
    window.location.href = "/";
    setAccessToken(null);
  }, [setAccessToken]);

  const getUserData = useCallback(async () => {
    const fetchAndSetData = async (fetchFunction, setStateFunction) => {
      try {
        const response = await fetchFunction();
        setStateFunction(response.data.items || response.data);
      } catch (error) {
        console.error(`Error fetching data: ${error}`);
      }
    };

    try {
      await fetchAndSetData(getUserArtists, setArtists);
      await fetchAndSetData(getUserTracks, setTracks);
      await fetchAndSetData(getUser, setUser);
      await fetchAndSetData(getUserFollowingArtists, (data) =>
        setFollowing(data.artists)
      );
      await fetchAndSetData(getUserRecentlyPlay, setRecentlyPlayed);

      const topTracksResponse = await getTopTracks("short_term");
      const topTracks = topTracksResponse.data.items.slice(0, 5);
      const seedTracks = topTracks.map((track: any) => track.id);
      if (!recommendedTracks) {
        try {
          const recommendedTracksResponse = await getRecommendations(
            seedTracks
          );
          setRecommendedTracks(recommendedTracksResponse.data.tracks);
          // Store recommended tracks in localStorage
          localStorage.setItem(
            "recommendedTracks",
            JSON.stringify(recommendedTracksResponse.data.tracks)
          );
          localStorage.setItem(
            "recommendedTracksTimestamp",
            new Date().getTime().toString()
          );
        } catch (error) {
          console.error("Error fetching recommended tracks:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response && error.response.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [logout, recommendedTracks]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getUserData();
      } catch (err) {
        logout();
      }
    };

    fetchData();
  }, [getUserData, logout]);

  function formatDuration(durationMs: number) {
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Ensure the seconds are always two digits (e.g., "01" instead of "1")
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${minutes}:${formattedSeconds}`;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pb-40">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="relative text-white p-1 pt-8 flex flex-col lg:flex-row h-screen">
      {/* Left section */}
      <div className="lg:w-2/6 flex flex-col items-center lg:fixed lg:top-20% lg:h-screen p-4">
        <img
          src={user?.images?.[1]?.url}
          alt={user?.displayName}
          className="w-44 h-44 lg:w-72 lg:h-72 rounded-full mb-4"
        />
        <h1 className="text-4xl font-bold mb-2">{user?.displayName}</h1>
        <div className="flex flex-col justify-center items-center">
          <h2 className="font-bold text-4xl md:text-5xl text-gray-300 mb-4 text-center">
            {user?.display_name}
          </h2>

          <div className="flex items-center text-gray-300 mb-4">
            <span className="text-spotify-green font-bold text-md lg:text-lg">
              {user.followers?.total || 0} followers • {following?.total || 0}{" "}
              following
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="hover:bg-red-500 ease-in-out transition duration-300 bg-spotify-grey text-white py-4 px-6 rounded-full text-xl "
        >
          Logout
        </button>
      </div>
      <div className="w-2/6"></div>

      {/* Right section */}
      <div className="w-full lg:w-4/6 lg:ml-auto lg:mt-5 h-screen">
        <main className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ProfileSection
            title="Top Artists"
            icon={<Music className="title-icon" />}
            items={artists.slice(0, 5)}
            setCurrentPage={setCurrentPage}
            navId="Artists"
            renderItem={(artist, index) => (
              <>
                <img
                  src={artist?.images[2]?.url}
                  alt={artist.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div className="lg:text-lg">{artist.name}</div>
              </>
            )}
          />

          <ProfileSection
            title="Top Tracks"
            icon={<Disc className="title-icon" />}
            items={tracks.slice(0, 5)}
            setCurrentPage={setCurrentPage}
            navId="Tracks"
            renderItem={(track, index) => (
              <>
                <img
                  src={track.album.images[2]?.url}
                  alt={track.name}
                  className="w-30 h-30 mr-8"
                />
                <div className="lg:text-lg flex-grow">
                  {track.name}
                  <div className="text-gray-300">
                    {track.artists[0].name} • {track.album.name}
                  </div>
                </div>
                <div className="text-gray-300">
                  {formatDuration(track.duration_ms)}
                </div>
              </>
            )}
          />

          <ProfileSection
            title="Recently Played"
            icon={<Clock className="title-icon" />}
            items={recentlyPlayed.slice(0, 5)}
            setCurrentPage={setCurrentPage}
            navId="Recent"
            renderItem={(track, index) => (
              <>
                <img
                  src={track.track.album?.images[2]?.url}
                  alt={track.track.name}
                  className="w-30 h-30 mr-8"
                />
                <div className="lg:text-lg flex-grow">
                  {track.track.name}
                  <div className="text-gray-300">
                    {track.track.artists[0].name} • {track.track.album.name}
                  </div>
                </div>
                <div className="text-gray-300">
                  {formatDuration(track.track.duration_ms)}
                </div>
              </>
            )}
          />

          <ProfileSection
            title="Recommended Tracks"
            icon={<PlayCircle className="title-icon" />}
            items={recommendedTracks.slice(0, 5)}
            setCurrentPage={setCurrentPage}
            navId="Recommendations"
            renderItem={(track, index) => (
              <>
                <img
                  src={track.album?.images[2]?.url}
                  alt={track.name}
                  className="w-30 h-30 mr-8"
                />
                <div className="lg:text-lg flex-grow">
                  {track.name}
                  <div className="text-gray-300">
                    {track.artists[0].name} • {track.album.name}
                  </div>
                </div>
                <div className="text-gray-300">
                  {formatDuration(track.duration_ms)}
                </div>
              </>
            )}
          />
        </main>
        <div className="py-10 lg:py-0 lg:w-2/6 flex justify-center items-center lg:fixed lg:left-10 lg:bottom-20">
          <Github size={20} className="mr-2 text-gray-500 rounded-full" />
          <a
            href="https://github.com/K-Rod12/spotify_dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-center text-gray-500"
          >
            Website made by Kenley Rodriguez
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
