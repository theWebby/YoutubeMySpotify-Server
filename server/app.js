var bodyParser = require("body-parser");
var cors = require("cors");
var express = require('express');
var fs = require('fs')
var https = require('https')
var http = require('http');
var spotifyTools = require("./spotifyTools")

console.log(process.cwd())

var httpApp = express();
httpApp.use(bodyParser.urlencoded({ extended: false }));
httpApp.use(bodyParser.json());
httpApp.use(cors())
httpApp.use(spotifyTools)

var httpsApp = express();
httpsApp.use(bodyParser.urlencoded({ extended: false }));
httpsApp.use(bodyParser.json());
httpsApp.use(cors())
httpsApp.use(spotifyTools)

https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/youtubemyspotify.uk/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/youtubemyspotify.uk/cert.pem')
}, httpsApp)
.listen(443, function () {
  console.log('Youtube My Spotify listening on 443!')
})

http.createServer(httpApp).listen(3000);
console.log('...also listening on 3000 (y tho?)')


// openssl req -nodes -new -x509 -keyout server.key -out server.cert
