// functions/src/index.js
const express = require("express");
const functions = require("firebase-functions");
const morgan = require("morgan");

const app = express();

const isLocal = functions.config().local?.value === "true";

if (isLocal) {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan(
      "[:date[clf]] :method :url :status :response-time ms - :res[content-length]"
    )
  );
}

// const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_ID = functions.config().app.client_id;
const CLIENT_SECRET = functions.config().app.client_secret;
let REDIRECT_URI =
  functions.config().app.redirect_uri || "http://localhost:8888/callback";
let FRONTEND_URI =
  functions.config().app.frontend_uri || "http://localhost:3000";
const PORT = functions.config().PORT || 8888;

const request = require("request");
const cors = require("cors");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const path = require("path");
const history = require("connect-history-api-fallback");

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = "spotify_auth_state";

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, "../client/build")));
app.get("/api/hello", function (req, res) {
  console.log(REDIRECT_URI);
  res.send(REDIRECT_URI);
});

app
  .use(express.static(path.resolve(__dirname, "../client/build")))
  .use(cors())
  .use(cookieParser())
  .use(
    history({
      verbose: true,
      rewrites: [
        { from: /\/login/, to: "/login" },
        { from: /\/callback/, to: "/callback" },
        { from: /\/refresh_token/, to: "/refresh_token" },
      ],
    })
  )
  .use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/", function (req, res) {
  res.render(path.resolve(__dirname, "../client/build/index.html"));
});

app.get("/login", function (req, res) {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);
  console.log("Redirect log:", REDIRECT_URI);

  // your application requests authorization
  const scope =
    "user-read-private user-read-email user-read-recently-played user-top-read user-follow-read user-follow-modify playlist-read-private playlist-read-collaborative playlist-modify-public";

  console.log(CLIENT_ID)
  console.log(REDIRECT_URI)
  console.log(state)
  res.redirect(
    `https://accounts.spotify.com/authorize?${querystring.stringify({
      response_type: "code",
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state,
    })}`
  );
});

app.get("/callback", function (req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;


  if (state === null || state !== storedState) {
    res.redirect(`/#${querystring.stringify({ error: "state_mismatch" })}`);
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization: `Basic ${new Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token;
        const refresh_token = body.refresh_token;

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          `${FRONTEND_URI}/#${querystring.stringify({
            access_token,
            refresh_token,
          })}`
        );
      } else {
        res.redirect(`/app/#${querystring.stringify({ error: "invalid_token" })}`);
      }
    });
  }
});

app.get("/refresh_token", function (req, res) {
  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    form: {
      grant_type: "refresh_token",
      refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({ access_token });
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Export the Express app as a Firebase Function
if (isLocal) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

exports.app = functions.https.onRequest(app);