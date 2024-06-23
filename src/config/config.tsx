const config = {
    clientId: process.env.REACT_APP_CLIENT_ID!,
};


if (!config.clientId) {
    throw new Error("Missing REACT_APP_CLIENT_ID environment variable");
  }

export default config;
