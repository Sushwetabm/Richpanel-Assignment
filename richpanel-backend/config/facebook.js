const axios = require('axios');

const getFacebookAuthUrl = () => {
  return `https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&scope=pages_manage_metadata,pages_messaging,pages_read_engagement`;
};

const exchangeCodeForToken = async (code) => {
  const { data } = await axios.get(
    `https://graph.facebook.com/v12.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}`
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
  getPageAccessToken
};