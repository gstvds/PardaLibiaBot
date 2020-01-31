const express = require('express')

const routes = express.Router();

const { getToken } = require('./index');

routes.post('/getToken', getToken)

module.exports = routes