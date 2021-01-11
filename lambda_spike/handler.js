"use strict";
var request = require("request");
const querystring = require("querystring");
const { resolve } = require("path");

const stateKey = "spotify_auth_state";
const SPOTIFY_CID = "7d6e6d5684a3404e834793cca7f8382d";
const SPOTIFY_SECRET = "18cdd7e2215e40289d5475f71b53eb5e";
var http = require("https");

const CLIENT_URL =
  "https://thewebby.github.io/YoutubeMySpotify/#/AccountManager/";

function getVideoId(songName, artistName) {
  return new Promise((resolve, reject) => {
    var q = songName + " " + artistName + " music video";
    q = q.replace(/[^a-zA-Z1-9 ]+/g, "");
    q = q.replace(/[ ]+/g, "+");

    var options = {
      host: "www.youtube.com",
      port: 443,
      path: `/results?search_query=${q}`,
    };

    http
      .get(options, function (res) {
        var body = "";

        res.on("data", function (chunk) {
          body += chunk;
        });
        res.on("end", function () {
          var txt = body;

          var re1 = ".*"; // Non-greedy match on filler
          var re2 = "((https://i.ytimg.com/vi/)[a-zA-Z0-9-_]+)"; // Alphanum 1

          var p = new RegExp(re2, ["i"]);
          var m = p.exec(txt);
          if (m != null) {
            var alphanum1 = m[1].replace(m[2], "");
            var result = alphanum1;

            resolve(result);
          }
        });
      })
      .on("error", function (e) {
        console.log("Got error: " + e.message);
      });
  });
}

module.exports.getVideoId = async (event) => {
  console.log(event);

  return {
    statusCode: 200,
    body: JSON.stringify({
      videoId: getVideoId("lose yourself", "eminem"),
    }),
  };
};

function login(event) {
  let response;
  const URI = "https://" + event.requestContext.domainName + "/";
  var Oauth = {
    client_id: SPOTIFY_CID,
    client_secret: SPOTIFY_SECRET,
    URI,
    redirect_uri: URI + "callback",
  };

  try {
    var state = generateRandomString(16);
    var scope =
      "user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state user-top-read";

    const spotifyAuthorizationParams = querystring.stringify({
      response_type: "code",
      client_id: Oauth.client_id,
      scope: scope,
      redirect_uri:
        Oauth.redirect_uri + `?clientUrl=${CLIENT_URL.replace("#", "%23")}`,
      state: state,
    });

    const redirectLocation =
      "https://accounts.spotify.com/authorize?" + spotifyAuthorizationParams;

    const spotifyAuthorizationHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
      "Cache-Control": "no-cache",
    };

    response = {
      statusCode: 301,
      headers: {
        Location: redirectLocation,
        ...spotifyAuthorizationHeaders,
      },
      multiValueHeaders: { "Set-Cookie": [`${stateKey}=${state}`] },
    };
  } catch (e) {
    console.log(e);
    response = {
      statusCode: 420,
      body: JSON.stringify(e),
    };
  }

  return response;
}

async function callback(event) {
  console.log("here");
  try {
    const { queryStringParameters } = event;

    const URI = "https://" + event.requestContext.domainName + "/";
    let Oauth = {
      client_id: SPOTIFY_CID,
      client_secret: SPOTIFY_SECRET,
      URI,
      redirect_uri: URI + "callback",
    };

    var code = queryStringParameters.code || null;
    var clientUrl = queryStringParameters.clientUrl || CLIENT_URL;
    // var state = queryStringParameters.state || null;
    // var storedState = req.cookies ? req.cookies[stateKey] : null;

    //should probably do something with the state here

    let authHeader = new Buffer.from(
      SPOTIFY_CID + ":" + SPOTIFY_SECRET
    ).toString("base64");

    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri:
          Oauth.redirect_uri + `?clientUrl=${clientUrl.replace("#", "%23")}`,
        grant_type: "authorization_code",
      },
      headers: { Authorization: "Basic " + authHeader },
      json: true,
    };

    console.log("here 1", authOptions);
    return new Promise((resolve, reject) => {
      request.post(authOptions, function (error, response, body) {
        console.log("here in request post");
        if (!error && response.statusCode === 200) {
          var access_token = body.access_token,
            refresh_token = body.refresh_token;

          const queryString = querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token,
          });
          const redirectLocation = `${clientUrl}?&${queryString}`;
          console.log("here 2", access_token, refresh_token, redirectLocation);
          resolve({
            statusCode: 301,
            headers: {
              YOLO: "YOLO 123",
              Location: redirectLocation,
            },
          });
        } else {
          console.log("here 3");
          resolve({
            statusCode: 500,
            body: JSON.stringify("Uh oh"),
          });
        }
      });
    });

    console.log("no not here pls");
  } catch (e) {
    console.log(e);
    return {
      statusCode: 420,
      body: JSON.stringify(e),
    };
  }
}

module.exports.login = async (event) => {
  console.log("yo yo event", event);
  switch (event.path) {
    case "/login":
      return login(event);
    case "/callback":
      return await callback(event);
    default:
      return {
        statusCode: 404,
      };
  }
};

var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
