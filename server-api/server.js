const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
require('dotenv').config();

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file'
}

app.use(cors());

const authenticate = jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

// Middleware to check permissions (scopes)
const authorize = function(req, res, next){
    switch(req.path){
        case '/api/private/admin':{
            var permissions = ['read:messages'];
            for(var i = 0; i < permissions.length; i++){
                if(req.user.scope.includes(permissions[i])){
                    next();
                } else {
                    res.status(403).send({message:'Forbidden'});
                }
            }
            break;
        }
    }
}

app.get('/api/public', function(req, res) {
  res.json({ message: "Hello from a public endpoint! You don't need to be authenticated to see this." });
});

app.get('/api/private', authenticate, function(req, res) {
  res.json({ message: "Hello from a private endpoint! You DO need to be authenticated to see this." });
});

app.get('/api/private/admin', authenticate, authorize, function(req, res) {
  res.json({ message: "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this." });
});

var port = process.env.PORT || 3090;
app.listen(port);
console.log('Listening on http://localhost:'+port);
