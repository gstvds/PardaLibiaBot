const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  consumerKey: process.env.consumerKey,
  consumerSecret: process.env.consumerSecret,
  accessToken: process.env.accessToken,
  BOT_TOKEN: process.env.BOT_TOKEN,
  PL_SPLT: process.env.PL_SPLT,
  PL_CHAT: process.env.PL_CHAT,
  LIBIA_ID: process.env.LIBIA_ID,
  PARDAL_ID: process.env.PARDAL_ID,
};