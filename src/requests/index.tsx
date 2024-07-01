import axios from 'axios';

const getLocalAccessToken = () => window.localStorage.getItem('spotifyAccessToken');

export const token = getLocalAccessToken();
const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

export const getUser = () => axios.get('https://api.spotify.com/v1/me', { headers });

export const getUserArtists = () => axios.get('https://api.spotify.com/v1/me/top/artists', { headers });
export const getUserTracks = () => axios.get('https://api.spotify.com/v1/me/top/tracks', { headers });
export const getUserFollowingArtists = () => axios.get('https://api.spotify.com/v1/me/following?type=artist', { headers });
export const getUserRecentlyPlay = () => axios.get('https://api.spotify.com/v1/me/player/recently-played', { headers });