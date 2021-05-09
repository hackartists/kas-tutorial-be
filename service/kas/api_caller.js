const request = require('request');

class ApiCaller {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    async call(options) {
        options.url = this.endpoint + options.url;
        options.json = true;

        if (!options.headers) options.headers = {};

        options.headers['x-chain-id'] = '1001';
        options.headers['content-type'] = 'application/json';
        options.headers.Authorization =
            'Basic S0FTS0EzUzkySDdKT1M5TjJTWTdQSzlNOlVyR3djUS9NQURHbHJIRUFaQmFBckVzRTBkVlVLY2ZhcG9TdkNhalU=';

        return new Promise((resolve, reject) => {
            request(options, function (error, _response, body) {
                if (error) reject(error);
                else resolve(body);
            });
        });
    }
}

module.exports = ApiCaller;
