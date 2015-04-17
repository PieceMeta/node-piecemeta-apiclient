# PieceMeta API Client

[![Code Climate](https://codeclimate.com/github/PieceMeta/node-piecemeta-apiclient/badges/gpa.svg)](https://codeclimate.com/github/PieceMeta/node-piecemeta-apiclient)

A javascript client for the [PieceMeta API](http://github.com/PieceMeta/piecemeta-api) (Node & Browser)


## Stability

Unstable: Expect patches and features, possible api changes.

## Using the client

Both implementations only differ in the setup procedure. Other than that they work identically. (Side note: progress is not yet implemented in the node version.)

### NodeJS

```javascript
var apiConfig = {
    host: 'http://localhost:8080',
    contentType: 'application/json',
    api_key: YOUR_PIECEMETA_API_KEY,            # optional if only anonymous requests
    access_token: YOUR_PIECEMETA_ACCESS_TOKEN   # optional if only anonymous requests
};

var apiClient = require('piecemeta-apiclient')(apiConfig);
```

### Browser

To use the client in the browser, include either `dist/piecemeta-apiclient.web.js` or `dist/piecemeta-apiclient.web.min.js`.

```javascript
var apiConfig = {
    host: host ? host : PIECEMETA_API_HOST,
    contentType: 'application/json',
    api_key: YOUR_PIECEMETA_API_KEY,            // optional if only anonymous requests
    access_token: YOUR_PIECEMETA_ACCESS_TOKEN   // optional if only anonymous requests
};

var apiClient = PMApi(apiConfig);
```

## Making requests

To make a request use a function call like this:

```javascript
apiClient.resource('packages').action(
    'get',  // HTTP method
    null,   // optional payload object
    function (err, result) {
        console.log('api response handler', err, result);
    },
    function (bytesLoaded, bytesTotal) {
        console.log('progress handler', bytesLoaded, bytesTotal);
    }
);
```

Nested resources can be accessed by using a resource name like `packages/PACKAGE_UUID/streams`.

## Authentication

To receive an Access Token from the API server:

```javascript
apiClient.getToken({ email: login, password: password }, function (err, token) {
    if (err) {
        console.log('access token error', err);
    } else {
        // You might want to store the token to use it later instead of the email/pass combo
        apiClient.setToken(token);
    }
});
```

If you have a token you can fetch your api credentials and make authenticated requests after that:

```javascript
apiClient.getCredentials(function (err, credentials) {
    console.log('credentials response', err, credentials);
});
```

