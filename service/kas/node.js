const request = require('request');
const Caver = require('caver-js');
const caver = new Caver('https://your.en.url:8651/');

class Node {
    constructor() {
        this.endpoint = 'https://node-api.klaytnapi.com';
    }

    async call(options) {
        options.url = this.endpoint + options.url;

        if (!options.headers) options.headers = {};

        options.headers['x-chain-id'] = '1001';
        options.headers.Authorization =
            'Basic S0FTS1JFRDdPRk40VDBLV1NMMkY4VFBEOjVmU0dMYzg1eXptZ3lNYzhPMzR2dHBVVXVjdS81c1RGZ0RDbHZFWFQ=';

        return new Promise((resolve, reject) => {
            request(options, function(error, _response, body) {
                if (error) reject(error);
                else resolve(body);
            });
        });
    };

    async getBalance(address) {
        const options = {
            method: 'POST',
            url: '/v1/klaytn',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                id: 1,
                jsonrpc: '2.0',
                method: 'klay_getBalance',
                params: [address, 'latest'],
            },
            json: true,
        };

        const ret = await this.call(options);
        const peb = caver.utils.hexToNumberString(ret.result);
        const klay = caver.utils.convertFromPeb(peb, "KLAY");

        return klay;
    };
}

const node = new Node();

module.exports = node;
