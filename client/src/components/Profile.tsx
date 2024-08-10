import React, { useState, useEffect } from "react";
import { Music, Disc, Clock, Users, PlayCircle } from "lucide-react";
import {
  getUser,
  getUserArtists,
  getUserTracks,
  getUserFollowingArtists,
  getUserRecentlyPlay,
  logout as logoutRequest,
} from "../requests";

const Profile = ({setAccessToken}: {setAccessToken:any}) => {
  const [artists, setArtists] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [user, setUser] = useState<any>({});
  const [following, setFollowing] = useState<any>({});
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Loading state

  // This data would normally come from the Spotify API
  const profileData = {
    name: "Jane Doe",
    imageUrl: "/api/placeholder/300/300",
    followers: 1234,
    following: 567,
    topArtists: ["The Beatles", "Queen", "David Bowie"],
    topTracks: ["Bohemian Rhapsody", "Hey Jude", "Life on Mars?"],
    recentlyPlayed: [
      "Starman",
      "Here Comes the Sun",
      "Another One Bites the Dust",
    ],
    playlists: 42,
    totalListeningTime: "2,345 hours",
  };

  const logout = () => {
    console.log('Logging out...');
    logoutRequest();
    window.location.href = "/";
    setAccessToken(null);
  };


  const getUserData = async () => {
    try {
      const artistsResponse = await getUserArtists();
      const tracksResponse = await getUserTracks();
      const userResponse = await getUser();
      const followingResponse = await getUserFollowingArtists();
      const recentlyPlayedResponse = await getUserRecentlyPlay();

      setArtists(artistsResponse.data.items);
      setTracks(tracksResponse.data.items);
      setUser(userResponse.data);
      setFollowing(followingResponse.data.artists);
      setRecentlyPlayed(recentlyPlayedResponse.data.items);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getUserData();
      } catch (err) {
        logout();
      }
    };

    fetchData();
  }, []);

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
    <div className="text-white p-1 pt-8">
      <div className="max-w-4xl mx-auto">
        <header className="bg-spotify-grey pt-5 pb-5 rounded-lg flex justify-center items-center mb-8">
          <img
            src={user?.images?.[1]?.url}
            alt={user?.displayName}
            className="w-40 h-40 rounded-full mr-8"
          />
          <div>
            <h1 className="text-4xl font-bold mb-2">{user?.displayName}</h1>
            <div className="flex items-center text-gray-300 mb-4">
              <Users className="mr-2" size={20} />
              <span>
                {user.followers?.total || 0} followers • {following?.total || 0}{" "}
                following
              </span>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 text-white py-2 px-4 rounded-full"
              style={{ borderRadius: "20px" }}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <section className="bg-spotify-grey p-6 rounded-lg">
            <h2 className="md:text-2xl text-lg font-bold mb-4 flex items-center">
              <Music className="mr-2 text-spotify-green" /> Top Artists
            </h2>
            <ul>
              {artists.slice(0, 3).map((artist, index) => (
                <li key={index} className="pt-3 flex items-center">
                  <img
                    src={artist.images[2].url}
                    alt={user?.displayName}
                    className="w-16 h-16 rounded-full mr-4"
                  ></img>
                  {artist.name}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-spotify-grey p-6 rounded-lg">
            <h2 className="md:text-2xl text-lg font-bold mb-4 flex items-center">
              <Disc className="mr-2 text-spotify-green" /> Top Tracks
            </h2>
            <ul>
              {tracks.slice(0, 3).map((track, index) => (
                <li key={index} className="pt-2 flex items-center">
                  <img
                    src={track.album.images[2].url}
                    alt={user?.displayName}
                    className="w-30 h-30 mr-8"
                  ></img>
                  <div className="flex-grow">
                    {track.name}
                    <div className="text-gray-300">
                      {track.artists[0].name} • {track.album.name}
                    </div>
                  </div>
                  <div className="text-gray-300">
                    {formatDuration(track.duration_ms)}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-spotify-grey p-6 rounded-lg">
            <h2 className="md:md:text-2xl text-lg text-lg font-bold mb-4 flex items-center">
              <Clock className="mr-2 text-spotify-green" /> Recently Played
            </h2>
            <ul>
              {recentlyPlayed.slice(0, 5).map((track, index) => (
                <li key={index} className="mb-2 flex items-center">
                  <img
                    src={track.track.album.images[2].url}
                    alt={user?.displayName}
                    className="w-30 h-30 mr-8"
                  ></img>
                  <div className="flex-grow">
                    {track.track.name}
                    <div className="text-gray-300">
                      {track.track.artists[0].name} • {track.track.album.name}
                    </div>
                  </div>
                  <div className="text-gray-300">
                    {formatDuration(track.track.duration_ms)}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-spotify-grey p-6 rounded-lg">
            <h2 className="md:text-2xl text-lg font-bold mb-4 flex items-center">
              <PlayCircle className="mr-2 text-spotify-green" /> Your Music
            </h2>
            <p className="mb-2">Playlists: {profileData.playlists}</p>
            <p>Total Listening Time: {profileData.totalListeningTime}</p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;
