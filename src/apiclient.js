(function () {

    'use strict';

    var config = {},
        parser = {},
        http = {};

    module.exports.client = function (httpService, dataParser, apiConfig) {
        var auth = require('./util/auth-header');
        http = httpService;
        parser = dataParser;
        config = apiConfig;
        return {
            resource: function (resourceName) {
                return {
                    action: function (method, data, callback, progress) {
                        var path = '/' + resourceName;

                        if (data === null) {
                            data = undefined;
                        }
                        if (typeof data === 'string') {
                            // supplied data is a resource id
                            path += '/' + data;
                            data = null;
                        } else if (typeof data === 'object' && typeof data.uuid === 'string' && method.toLowerCase() === 'post') {
                            // check if resource object contains id
                            path += '/' + data.uuid;
                            delete data.uuid;
                        }

                        http.request(
                            {
                                url: config.host + path,
                                auth: auth.getTokenHeader(config.access_token),
                                method: method,
                                contentType: config.contentType,
                                data: data ? parser.unparse(data, config.contentType) : undefined
                            },
                            function (err, result) {
                                if (typeof callback === 'function') {
                                    if (err) {
                                        return callback(err, null);
                                    }
                                    parser.parse(result, config.contentType, function (err, object) {
                                        callback(err, object);
                                    });
                                }
                            },
                            function (bytesLoaded, bytesTotal) {
                                if (typeof progress === 'function') {
                                    progress(bytesLoaded, bytesTotal);
                                }
                            }
                        );
                    }
                };
            },
            getToken: function (credentials, callback) {
                http.request(
                    {
                        url: config.host + '/users/me/access_tokens',
                        method: 'post',
                        contentType: config.contentType,
                        data: parser.unparse(credentials, config.contentType)
                    },
                    function (err, result) {
                        if (typeof callback === 'function') {
                            if (err) {
                                return callback(err, null);
                            }
                            parser.parse(result, config.contentType, function (err, access_token) {
                                if (!err && access_token) {
                                    config.access_token = access_token;
                                }
                                callback(err, access_token);
                            });
                        }
                    }
                );
            },
            getCredentials: function (callback) {
                http.request(
                    {
                        url: config.host + '/users/me/api_keys',
                        method: 'get',
                        contentType: config.contentType,
                        auth: auth.getTokenHeader(config.access_token)
                    },
                    function (err, result) {
                        if (typeof callback === 'function') {
                            if (err) {
                                return callback(err, null);
                            }
                            parser.parse(result, config.contentType, function (err, api_keys) {
                                if (!config.api_key) {
                                    config.api_key = {};
                                }
                                config.api_key.key = api_keys[0].key;
                                config.api_key.secret = api_keys[0].secret;
                                callback(err, api_keys[0]);
                            });
                        }
                    }
                );
            },
            setCredentials: function (apiKey, apiSecret) {
                config.api_key.key = apiKey;
                config.api_key.secret = apiSecret;
            },
            authenticate: function (callback) {
                if (config.access_token) {
                    callback(null, config.access_token.token);
                } else {
                    http.request(
                        {
                            url: config.host + '/users/me/access_tokens',
                            method: 'post',
                            contentType: config.contentType,
                            data: parser.unparse(config.api_key, config.contentType)
                        },
                        function (err, result) {
                            if (typeof callback === 'function') {
                                if (err) {
                                    return callback(err, null);
                                }
                                parser.parse(result, config.contentType, function (err, access_token) {
                                    if (!err && access_token) {
                                        config.access_token = access_token;
                                    }
                                    callback(err, access_token);
                                });
                            }
                        }
                    );
                }
            }
        };
    };

})();