import useAuth from "./Auth";
import "./App.css";

function App() {
  const { profile, isLoggedIn, login, logout } = useAuth();
  console.log("App: ", profile, isLoggedIn);

  return (
    <div>
      <h1>Spotify Profile</h1>
      <div id="profile">
        {isLoggedIn ? (
          <>
            <p id="displayName">{profile?.displayName}</p>
            <div id="avatar">
              <img src={profile?.avatarUrl} alt="Avatar" />
            </div>
            <p id="id">{profile?.id}</p>
            <p id="email">{profile?.email}</p>
            <a id="uri" href={profile?.uri}>
              {profile?.uri}
            </a>
            <br/>
            <a id="url" href={profile?.url}>
              {profile?.url}
            </a>
            <p id="imgUrl">{profile?.imgUrl}</p>
            <button onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <p>Please log in to see your profile.</p>
            <button onClick={login}>Log In</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
