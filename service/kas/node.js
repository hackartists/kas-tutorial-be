const request = require('request');

class Node {
    constructor() {
        this.endpoint = 'https://node-api.klaytnapi.com';
    }

    call = async (options) => {
        options.url = this.endpoint;

        if (!options.headers) options.headers = {};

        options.headers['x-chain-id'] = '1001';
        options.headers.Authorization =
            'Basic S0FTS1JFRDdPRk40VDBLV1NMMkY4VFBEOjVmU0dMYzg1eXptZ3lNYzhPMzR2dHBVVXVjdS81c1RGZ0RDbHZFWFQ=';

        return new Promise((resolve, reject) => {
            request(options, function (error, _response, body) {
                if (error) reject(error);
                else resolve(body);
            });
        });
    };

    getBalance = async (address) => {
        const options = {
            method: 'POST',
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

        return ret.result;
    };
}

const node = new Node();

module.export = node;
