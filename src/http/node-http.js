(function () {

    'use strict';

    var http = require('http'),
        url = require('url');

    module.exports.request = function (config, callback, progress) {

        var parsedUrl = url.parse(config.url);
        var requestSetup = {
            host: parsedUrl.host,
            port: parsedUrl.port,
            path: parsedUrl.path,
            method: config.method,
            headers: {
                'Content-Type': config.contentType
            }
        };

        if (config.auth) {
            requestSetup.headers.Authorization = config.auth;
        }

        var req = http.request(requestSetup, function (res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));

            var error = null;

            if (res.statusCode !== 200 && res.statusCode !== 201) {
                error = new Error('Server responded with status: ' + req.status);
            }

            res.setEncoding('utf8');

            res.on('data', function (data) {
                console.log('BODY: ' + data);
                callback(error, data);
            });
        });

        req.on('error', function (err) {
            console.log('problem with request: ' + err.message);
            callback(err, null);
        });

        if (config.data) {
            req.write(config.data);
        }

        req.end();
    };

})();