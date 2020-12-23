"use strict";
const querystring = require('querystring');
const stateKey = 'spotify_auth_state';

function login(event){
  let response
  const URI = 'https://' + event.requestContext.domainName + '/';
  var Oauth = {
    client_id: '7d6e6d5684a3404e834793cca7f8382d',
    client_secret: '18cdd7e2215e40289d5475f71b53eb5e',
    URI,
    redirect_uri: URI + 'callback'
  }
  
  
  
  try{
    var clientUrl = 'https://thewebby.github.io/YoutubeMySpotify/';
    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state user-top-read';
    
  
    const spotifyAuthorizationParams = querystring.stringify({
      response_type: 'code',
      client_id: Oauth.client_id,
      scope: scope,
      redirect_uri: Oauth.redirect_uri + `?clientUrl=${clientUrl.replace('#', '%23')}`,
      state: state
    });
  
    const redirectLocation = 'https://accounts.spotify.com/authorize?' + spotifyAuthorizationParams;
  
    const spotifyAuthorizationHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
      "Cache-Control": "no-cache"
    }
  
    response = {
      statusCode: 301,
      headers: {
        Location: redirectLocation,
        ...spotifyAuthorizationHeaders
      },
      multiValueHeaders : {"Set-Cookie": [`${stateKey}=${state}`]},
    };
  } catch (e){
    console.log(e);
    response = {
      statusCode: 420,
      body: JSON.stringify(e)
    }
  }

  return response;  
}

function callback(event){
  return {
    statusCode: 200,
    body: JSON.stringify("Logged in")
  }
}

module.exports.login = async (event) => {
  console.log("yo yo event", event)
  switch(event.path){
    case '/login':
      return login(event);
    case '/callback':
      return callback(event);
    default:
      return {
        statusCode: 404 
      }
  }
};


var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};