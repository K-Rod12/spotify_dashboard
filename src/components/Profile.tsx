import { useState, useEffect } from "react";
import { Music, Disc, Clock, Users, PlayCircle } from "lucide-react";
import {
  getUser,
  getUserArtists,
  getUserTracks,
  getUserFollowingArtists,
  getUserRecentlyPlay,
} from "../requests";

const Profile = ({
  profile,
  onLogout,
}: {
  profile: any;
  onLogout: () => void;
}) => {
  const [artists, setArtists] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [user, setUser] = useState<any>({});
  const [following, setFollowing] = useState<any>({});
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);

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

  const getUserData = async () => {
    const dataTest = {
      artists: (await getUserArtists()).data.items,
      tracks: (await getUserTracks()).data.items,
      user: (await getUser()).data,
      following: (await getUserFollowingArtists()).data.artists,
      recentlyPlayed: (await getUserRecentlyPlay()).data.items,
    };
    console.log("Data test:", dataTest);

    return dataTest;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserData();
        console.log(response.following); // This logs the response correctly
        setTracks(response.tracks);
        setArtists(response.artists);
        setUser(response.user);
        setFollowing(response.following);
        setRecentlyPlayed(response.recentlyPlayed);
      } catch (err) {
        console.error(err);
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

  return (
    <div className="bg-black text-white p-1 pt-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-center items-center mb-8">
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="w-40 h-40 rounded-full mr-8"
          />
          <div>
            <h1 className="text-4xl font-bold mb-2">{profile.displayName}</h1>
            <div className="flex items-center text-gray-300">
              <Users className="mr-2" size={20} />
              <span>
                {user.followers?.total || 0} followers • {following.total || 0}{" "}
                following
              </span>
            </div>
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
                    alt={profile.displayName}
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
                    alt={profile.displayName}
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
              {recentlyPlayed.slice(0,5).map((track, index) => (
                <li key={index} className="mb-2 flex items-center">
                  <img
                    src={track.track.album.images[2].url}
                    alt={profile.displayName}
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
