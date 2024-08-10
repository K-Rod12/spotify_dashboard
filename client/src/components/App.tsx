import React, { useEffect, useState } from "react";
import "../index.css"; // or './App.css' depending on your file name
import Login from "./Login";
import Home from "./Home";
import { token } from '../requests';

function App() {
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    setAccessToken(token);
  }, []);

  return (
    <>
      {accessToken ? (
        <Home />
      ) : (
        <Login />
      )}
    </>
  );
}

export default App;
