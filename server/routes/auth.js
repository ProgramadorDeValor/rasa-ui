const jwt = require('jsonwebtoken');
const db = require('../db/db');
const authModule = require('../db/auth');
const logger = require('../util/logger');
const bcrypt = require('bcrypt');

function authenticateUser(req, res, next) {
  //authenticate user
  logger.winston.info('Authenticate User');
  var username = req.body.username;
  var password = req.body.password;
  authModule.login(req, res, next)
  .then (function(result) {
    //create token and send it back
    const tokenData = { username: username, name: 'Portal Administrator' };
    // if user is found and password is right
    // create a token
    const token = jwt.sign(tokenData, global.jwtsecret);
    // return the information including token as JSON
    res.json({ username: username, token });
  })
  .catch (function (err) {
    logger.winston.info('Information didnt match or not provided.');
    return res.status(401).send({
      success: false,
      message: 'Username and password didnt match.'
    });
  });
}

function authenticateClient(req, res, next) {
  //authenticate client based on client secret key
  //username,user_fullname,agent_name,client_secret_key should all be present in the body
  logger.winston.info('Authenticate Client');
  db.one(
    'select * from agents where agent_name = $1 and client_secret_key=$2',
    [req.body.agent_name, req.body.client_secret_key]
  )
    .then(function(data) {
      const tokenData = {
        username: req.body.username,
        name: req.body.user_fullname};
      // if user is found and password is right
      // create a token
      const token = jwt.sign(tokenData, global.jwtsecret);
      // return the information including token as JSON
      res.status(200).json({ username: req.body.username, token: token });
    })
    .catch(function(err) {
      logger.winston.info('Client Authentication error: ' + err);
      return res.status(401).send({
        success: false,
        message: 'Client Authentication failed.'});
    });
}

module.exports = {
  authenticateUser: authenticateUser,
  authenticateClient: authenticateClient
};
