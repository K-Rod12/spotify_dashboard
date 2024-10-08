import axios from "axios";
// import { getHashParams } from '../utils';

const api = process.env.REACT_APP_FUNCTIONS_API;

export const getSongsFromPrompt = async (prompt: string) => {
  try {
    const response = await axios.post(`${api}/generatePlaylist`, {
      prompt
    });

    const tracks = response.data.tracks;
    // Fetch songs from Spotify based on the song titles
    const songPromises = tracks.map((title) =>
      axios
        .get(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            title
          )}&type=track`,
          {
            headers,
          }
        )
        .then((res) => res.data.tracks.items[0])
    );

    const songs = await Promise.all(songPromises);
    return {playlistName: response.data.playlistName, playlistDescription: response.data.playlistDescription, tracks: songs };
    // As spotifyResponse is not defined, we'll return the result instead
  } catch (error) {
    console.error("Error fetching songs from prompt:", error);
    throw error;
  }
};

const getHashParams = () => {
  const hashParams = {};
  let e;
  const r = /([^&;=]+)=?([^&;]*)/g;
  const q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
};

// TOKENS ******************************************************************************************
const EXPIRATION_TIME = 3600 * 1000; // 3600 seconds * 1000 = 1 hour in milliseconds

const setTokenTimestamp = () =>
  window.localStorage.setItem("spotify_token_timestamp", Date.now().toString());
const setLocalAccessToken = (token) => {
  setTokenTimestamp();
  window.localStorage.setItem("spotify_access_token", token);
};
const setLocalRefreshToken = (token) =>
  window.localStorage.setItem("spotify_refresh_token", token);
const getTokenTimestamp = () =>
  window.localStorage.getItem("spotify_token_timestamp");
const getLocalAccessToken = () =>
  window.localStorage.getItem("spotify_access_token");
const getLocalRefreshToken = () =>
  window.localStorage.getItem("spotify_refresh_token");

// Refresh the token
const refreshAccessToken = async () => {
  try {
    const { data } = await axios.get(
      `/refresh_token?refresh_token=${getLocalRefreshToken()}`
    );
    const { access_token } = data;
    setLocalAccessToken(access_token);
    window.location.reload();
    return;
  } catch (e) {
    console.error(e);
  }
};

// Get access token off of query params (called on application init)
export const getAccessToken = () => {
  const params = getHashParams();
  const error = params["error"];
  const access_token = params["access_token"];
  const refresh_token = params["refresh_token"];

  if (error) {
    console.error(error);
    refreshAccessToken();
  }

  const tokenTimestamp = getTokenTimestamp();
  // If token has expired

  if (
    tokenTimestamp &&
    Date.now() - parseInt(tokenTimestamp) > EXPIRATION_TIME
  ) {
    console.warn("Access token has expired, refreshing...");
    refreshAccessToken();
  }

  const localAccessToken = getLocalAccessToken();

  // If there is no ACCESS token in local storage, set it and return `access_token` from params
  if ((!localAccessToken || localAccessToken === "undefined") && access_token) {
    setLocalAccessToken(access_token);
    setLocalRefreshToken(refresh_token);
    return access_token;
  }

  return localAccessToken;
};

export const token = getAccessToken();

export const logout = () => {
  window.localStorage.removeItem("spotify_token_timestamp");
  window.localStorage.removeItem("spotify_access_token");
  window.localStorage.removeItem("spotify_refresh_token");
  window.location.reload();
};

// API CALLS ***************************************************************************************

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

/**
 * Get Current User's Profile
 * https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/
 */
export const getUser = () =>
  axios.get("https://api.spotify.com/v1/me", { headers });

/**
 * Get User's Followed Artists
 * https://developer.spotify.com/documentation/web-api/reference/follow/get-followed/
 */
export const getFollowing = () =>
  axios.get("https://api.spotify.com/v1/me/following?type=artist", { headers });

/**
 * Get Current User's Recently Played Tracks
 * https://developer.spotify.com/documentation/web-api/reference/player/get-recently-played/
 */
export const getRecentlyPlayed = () =>
  axios.get("https://api.spotify.com/v1/me/player/recently-played", {
    headers,
  });

/**
 * Get a List of Current User's Playlists
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-a-list-of-current-users-playlists/
 */
export const getPlaylists = () =>
  axios.get("https://api.spotify.com/v1/me/playlists", { headers });

/**
 * Get a User's Top Artists
 * https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
 */
export const getTopArtists = (time_range = "short_term") =>
  axios.get(
    `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${time_range}`,
    {
      headers,
    }
  );
export const getTopArtistsMedium = () =>
  axios.get(
    "https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term",
    {
      headers,
    }
  );
export const getTopArtistsLong = () =>
  axios.get(
    "https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term",
    { headers }
  );
export const getNewReleases = () =>
  axios.get("https://api.spotify.com/v1/browse/new-releases", { headers });

/**
 * Get a User's Top Tracks
 * https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
 */
export const getTopTracks = (time_range = "short_term") =>
  axios.get(
    `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${time_range}`,
    { headers }
  );
export const getTopTracksMedium = () =>
  axios.get(
    "https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term",
    {
      headers,
    }
  );
export const getTopTracksLong = () =>
  axios.get(
    "https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term",
    { headers }
  );

/**
 * Get an Artist
 * https://developer.spotify.com/documentation/web-api/reference/artists/get-artist/
 */
export const getArtist = (artistId) =>
  axios.get(`https://api.spotify.com/v1/artists/${artistId}`, { headers });

/**
 * Follow an Artist
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-artists-users/
 */
export const followArtist = (artistId) => {
  const url = `https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`;
  return axios({ method: "put", url, headers });
};

/**
 * Check if Current User Follows Artists
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-artists-users/
 */
export const doesUserFollowArtist = (artistId) =>
  axios.get(
    `https://api.spotify.com/v1/me/following/contains?type=artist&ids=${artistId}`,
    {
      headers,
    }
  );

/**
 * Check if Users Follow a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-artists-users/
 */
export const doesUserFollowPlaylist = (playlistId, userId) =>
  axios.get(
    `https://api.spotify.com/v1/playlists/${playlistId}/followers/contains?ids=${userId}`,
    {
      headers,
    }
  );

/**
 * Create a Playlist (The playlist will be empty until you add tracks)
 * https://developer.spotify.com/documentation/web-api/reference/playlists/create-playlist/
 */
export const createPlaylist = (userId, name, playlistDescription) => {
  const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
  const data = JSON.stringify({ name, description: playlistDescription });
  return axios({ method: "post", url, headers, data });
};

/**
 * Add Tracks to a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/playlists/add-tracks-to-playlist/
 */
export const addTracksToPlaylist = (playlistId, uris) => {
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${uris}`;
  return axios({ method: "post", url, headers });
};

/**
 * Follow a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/follow/follow-playlist/
 */
export const followPlaylist = (playlistId) => {
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/followers`;
  return axios({ method: "put", url, headers });
};

/**
 * Get a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlist/
 */
export const getPlaylist = (playlistId) =>
  axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, { headers });

/**
 * Get a Playlist's Tracks
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlists-tracks/
 */
export const getPlaylistTracks = (playlistId) =>
  axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers,
  });

/**
 * Return a comma separated string of track IDs from the given array of tracks
 */
const getTrackIds = (tracks) => tracks.map(({ track }) => track.id).join(",");

/**
 * Get Audio Features for Several Tracks
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-audio-features/
 */
export const getAudioFeaturesForTracks = (tracks) => {
  const ids = getTrackIds(tracks);
  return axios.get(`https://api.spotify.com/v1/audio-features?ids=${ids}`, {
    headers,
  });
};

/**
 * Get Recommendations Based on Seeds
 * https://developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/
 */
export const getRecommendationsForTracks = (tracks) => {
  const shuffledTracks = tracks.sort(() => 0.5 - Math.random());
  const seed_tracks = getTrackIds(shuffledTracks.slice(0, 5));
  const seed_artists = "";
  const seed_genres = "";

  return axios.get(
    `https://api.spotify.com/v1/recommendations?seed_tracks=${seed_tracks}&seed_artists=${seed_artists}&seed_genres=${seed_genres}`,
    {
      headers,
    }
  );
};

/**
 * Get a Track
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-track/
 */
export const getTrack = (trackId) =>
  axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, { headers });

/**
 * Get Audio Analysis for a Track
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-analysis/
 */
export const getTrackAudioAnalysis = (trackId) =>
  axios.get(`https://api.spotify.com/v1/audio-analysis/${trackId}`, {
    headers,
  });

/**
 * Get Audio Features for a Track
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/
 */
export const getTrackAudioFeatures = (trackId) =>
  axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
    headers,
  });

export const getUserInfo = () =>
  axios
    .all([
      getUser(),
      getFollowing(),
      getPlaylists(),
      getTopArtistsLong(),
      getTopTracksLong(),
    ])
    .then(
      axios.spread(
        (user, followedArtists, playlists, topArtists, topTracks) => ({
          user: user.data,
          followedArtists: followedArtists.data,
          playlists: playlists.data,
          topArtists: topArtists.data,
          topTracks: topTracks.data,
        })
      )
    );

export const getUserArtists = () =>
  axios.get("https://api.spotify.com/v1/me/top/artists", { headers });
export const getUserTracks = () =>
  axios.get("https://api.spotify.com/v1/me/top/tracks", { headers });
export const getUserFollowingArtists = () =>
  axios.get("https://api.spotify.com/v1/me/following?type=artist", { headers });
export const getUserRecentlyPlay = () =>
  axios.get("https://api.spotify.com/v1/me/player/recently-played", {
    headers,
  });

export const getTrackInfo = (trackId) =>
  axios
    .all([
      getTrack(trackId),
      getTrackAudioAnalysis(trackId),
      getTrackAudioFeatures(trackId),
    ])
    .then(
      axios.spread((track, audioAnalysis, audioFeatures) => ({
        track: track.data,
        audioAnalysis: audioAnalysis.data,
        audioFeatures: audioFeatures.data,
      }))
    );

export const getRecommendations = async (seedTracks = []) => {
  const response = await axios.get(
    "https://api.spotify.com/v1/recommendations",
    {
      headers,
      params: {
        seed_tracks: seedTracks.join(","),
        limit: 20, // Limit the number of recommendations
      },
    }
  );
  return response;
};
