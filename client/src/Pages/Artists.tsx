import React, { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { getTopArtists } from "../requests"; // Ensure this function is defined in your requests file

const TopArtist = () => {
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("short_term");
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    const fetchTopArtists = async () => {
      setLoading(true);
      try {
        const response = await getTopArtists(timeRange);
        let artists = response.data.items;
        
        // Sort by popularity if the sort option is set to popularity
        if (sortOption === "popularity") {
          artists = artists.sort((a: any, b: any) => b.popularity - a.popularity);
        }

        setTopArtists(artists);
      } catch (error) {
        console.error("Error fetching top artists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopArtists();
  }, [timeRange, sortOption]);

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  const handleSortOptionChange = (option: string) => {
    setSortOption(option);
  };

  return (
    <div className="text-white pt-8 flex flex-col items-center">
      <div className="flex flex-col justify-between items-center w-full mb-8">
        <h1 className="text-4xl font-bold m-5">Top Artists</h1>
        <div className="flex lg:space-x-4 text-center text-sm md:text-lg">
          <span
            className={`hover:text-white cursor-pointer ${timeRange === "short_term" ? "text-white underline underline-offset-2" : "text-gray-500"}`}
            onClick={() => handleTimeRangeChange("short_term")}
          >
            Last 4 Weeks
          </span>
          <span
            className={`hover:text-white cursor-pointer ${timeRange === "medium_term" ? "text-white underline underline-offset-2" : "text-gray-500"}`}
            onClick={() => handleTimeRangeChange("medium_term")}
          >
            Last 6 Months
          </span>
          <span
            className={`hover:text-white cursor-pointer ${timeRange === "long_term" ? "text-white underline underline-offset-2" : "text-gray-500"}`}
            onClick={() => handleTimeRangeChange("long_term")}
          >
            All Time
          </span>
          <div className="flex items-center">
            <span className="text-white mx-2">|</span>
          </div>
          <span
            className={`hover:text-green-400 cursor-pointer ${sortOption === "popularity" ? "text-spotify-green underline underline-offset-2" : "text-gray-500"}`}
            onClick={() => handleSortOptionChange(sortOption === "default" ? "popularity" : "default")}
          >
            By Popularity
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen pb-40">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-10 justify-center">
          {topArtists.map((artist, index) => (
            <div key={index} className="relative group w-64 h-64 mb-10">
              <img
                src={artist.images[0]?.url}
                alt={artist.name}
                className="w-full h-full rounded-full object-cover transition duration-300 ease-in-out group-hover:blur-sm"
              />
              <a
                href={`https://open.spotify.com/artist/${artist.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out"
              >
                <Play className="w-12 h-12 text-white" />
              </a>
              <div className="flex flex-row mt-4 justify-center">
                <h2 className="text-xl font-bold text-center opacity-0 group-hover:opacity-50 transition-opacity duration-300 absolute left-0">
                  {sortOption === "popularity" ? `${artist.popularity}%` : `${index + 1}.`}
                </h2>
                <h2 className="text-xl font-bold text-center px-6">
                  {artist.name}
                </h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopArtist;