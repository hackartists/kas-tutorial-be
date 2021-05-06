const request = require('request');
const Caver = require('caver-js');
const caver = new Caver('https://your.en.url:8651/');

class TokenHistory {
    constructor() {
        this.endpoint = 'https://th-api.klaytnapi.com';
    }

    async call(options) {
        options.url = this.endpoint + options.url;

        if (!options.headers) options.headers = {};

        options.headers['x-chain-id'] = '1001';
        options.headers['content-type'] = 'application/json';
        options.headers.Authorization =
            'Basic S0FTS1JFRDdPRk40VDBLV1NMMkY4VFBEOjVmU0dMYzg1eXptZ3lNYzhPMzR2dHBVVXVjdS81c1RGZ0RDbHZFWFQ=';

        return new Promise((resolve, reject) => {
            request(options, function(error, _response, body) {
                if (error) reject(error);
                else resolve(body);
            });
        });
    }

    async klayHistory(address, starttime, endtime) {
        const options = {
            method: 'GET',
            url: `/v2/transfer/account/${address}`,
            qs: {
                kind: 'klay',
                range: `${starttime},${endtime}`,
            },
        };

        const res = await this.call(options);
        console.log(res);

        return res.items;
    }
}
