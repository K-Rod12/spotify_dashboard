import { useState, useEffect } from "react";
import { redirectToAuthCodeFlow, getAccessToken, fetchProfile } from "./script";
import config  from "./config/config";

interface Profile {
  displayName: string;
  avatarUrl: string;
  id: string;
  email: string;
  uri: string;
  url: string;
  imgUrl: string;
}

const useAuth = (): {
  profile: Profile | null;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
} => {
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => {
    // Check if the user profile and access token exist in localStorage
    const storedProfile = localStorage.getItem("spotifyProfile");
    const storedAccessToken = localStorage.getItem("spotifyAccessToken");

    if (storedProfile && storedAccessToken) {
      setProfile(JSON.parse(storedProfile));
    } else {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        (async () => {
          try {
            console.log("client id: ", config.clientId);

            const accessToken = await getAccessToken(config.clientId, code);
            const profileData = await fetchProfile(accessToken);
            setProfile(profileData);

            // Save the access token and profile to localStorage
            localStorage.setItem("spotifyProfile", JSON.stringify(profileData));
            localStorage.setItem("spotifyAccessToken", accessToken);
          } catch (error) {
            console.error("Error fetching profile", error);
          }
        })();
      }
    }
  }, []);

  const login = () => {
    redirectToAuthCodeFlow();
  };

  const logout = () => {
    setProfile(null);
    // Optionally, you can remove any stored tokens here if necessary
    localStorage.removeItem("spotifyProfile");
    localStorage.removeItem("spotifyAccessToken");
    window.location.href = window.location.origin;
  };

  return {
    profile,
    isLoggedIn: !!profile,
    login,
    logout,
  };
};

export default useAuth;
