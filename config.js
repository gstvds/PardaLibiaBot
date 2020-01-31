const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  consumerKey: process.env.consumerKey,
  consumerSecret: process.env.consumerSecret,
  accessToken: process.env.accessToken,
  botToken: process.env.botToken,
};