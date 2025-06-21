const axios = require("axios");

const getFacebookAuthUrl = () => {
  // Encode the redirect URI component
  const redirectUri = encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI);
  return `https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${redirectUri}&scope=pages_manage_metadata,pages_messaging,pages_read_engagement`;
};

const exchangeCodeForToken = async (code, redirectUri) => {
  const encodedUri = encodeURIComponent(redirectUri);
  const { data } = await axios.get(
    `https://graph.facebook.com/v12.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${encodedUri}&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}`
  );
  return data.access_token;
};

const getPageAccessToken = async (userAccessToken, pageId) => {
  const { data } = await axios.get(
    `https://graph.facebook.com/v12.0/${pageId}?fields=access_token&access_token=${userAccessToken}`
  );
  return data.access_token;
};

module.exports = {
  getFacebookAuthUrl,
  exchangeCodeForToken,
  getPageAccessToken,
};
