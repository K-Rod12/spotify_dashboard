import React, { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { getTopTracks } from "../requests"; // Ensure this function is defined in your requests file

const TopTracks = () => {
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("short_term");
  const [sortOption, setSortOption] = useState("default");
  const [showScores, setShowScores] = useState(false);

  useEffect(() => {
    const fetchTopTracks = async () => {
      setLoading(true);
      try {
        const response = await getTopTracks(timeRange);
        let tracks = response.data.items;
        // Sort by popularity if the sort option is set to popularity
        if (sortOption === "popularity") {
          tracks = tracks.sort((a: any, b: any) => b.popularity - a.popularity);
        }

        setTopTracks(tracks); // Set all top tracks
      } catch (error) {
        console.error("Error fetching top tracks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopTracks();
  }, [timeRange, sortOption]);

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  const handleSortOptionChange = (option: string) => {
    setSortOption(option);
  };

  const handleShowScoresToggle = () => {
    setShowScores(!showScores);
  };

  return (
    <div className="text-white p-1 pt-8 flex flex-col items-center min-h-screen">
      <div className="flex flex-col justify-between items-center w-full mb-8">
        <h1 className="text-4xl font-bold m-5">Top Tracks</h1>
        <div className="flex space-x-2 md:space-x-4 text-center text-sm md:text-lg">
          <span
            className={`hover:text-white cursor-pointer ${
              timeRange === "short_term"
                ? "text-white underline underline-offset-2"
                : "text-gray-500"
            }`}
            onClick={() => handleTimeRangeChange("short_term")}
          >
            Last 4 Weeks
          </span>
          <span
            className={`hover:text-white cursor-pointer ${
              timeRange === "medium_term"
                ? "text-white underline underline-offset-2"
                : "text-gray-500"
            }`}
            onClick={() => handleTimeRangeChange("medium_term")}
          >
            Last 6 Months
          </span>
          <span
            className={`hover:text-white cursor-pointer ${
              timeRange === "long_term"
                ? "text-white underline underline-offset-2"
                : "text-gray-500"
            }`}
            onClick={() => handleTimeRangeChange("long_term")}
          >
            All Time
          </span>
          <div className="flex items-center">
            <span className="text-white mx-2">|</span>
          </div>
          <span
            className={`hover:text-green-400 cursor-pointer ${
              sortOption === "popularity"
                ? "text-spotify-green underline underline-offset-2"
                : "text-gray-500"
            }`}
            onClick={() =>
              handleSortOptionChange(
                sortOption === "default" ? "popularity" : "default"
              )
            }
          >
            By Popularity
          </span>
          <span
            className={`hover:text-green-400 cursor-pointer ${
              showScores
                ? "text-spotify-green underline underline-offset-2"
                : "text-gray-500"
            }`}
            onClick={handleShowScoresToggle}
          >
            Show Scores
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen pb-40">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 w-full">
          {topTracks.map((track, index) => (
            <div key={index} className="relative group mb-20 ">
              <div className="relative w-full h-full">
                <img
                  src={track.album.images[0]?.url}
                  alt={track.name}
                  className="w-full h-full rounded-full object-cover transition duration-300 ease-in-out group-hover:blur-sm group-hover:scale-105"
                />
                <div
                  className={`${
                    showScores ? "opacity-100" : "opacity-0"
                  } absolute inset-0 animate ease-in-out duration-700 flex justify-center items-center`}
                >
                  <h2 className="text-6xl font-bold text-white opacity-50 z-10">
                    {`${track.popularity}%`}
                  </h2>
                </div>
                <a
                  href={`https://open.spotify.com/track/${track.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out bg-black bg-opacity-50 rounded-full"
                >
                  <Play className="w-12 h-12 text-white" />
                </a>
              </div>

              <div className="my-4 text-center justify-center">
                <h2 className="text-xl font-bold opacity-0 group-hover:opacity-50 transition-opacity duration-300 absolute left-0 top-0">
                  {`${index + 1}`}
                </h2>
                <h2 className="lg:text-xl font-bold text-center px-2">
                  {track.name}
                </h2>
                <p className="text-gray-300 text-center">
                  {track.artists[0].name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopTracks;
