class Wallet {
    constructor() {
        this.endpoint = 'https://wallet-api.klaytnapi.com';
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

    createAccount = async () => {
        const request = require('request');

        const options = {
            method: 'POST',
        };

        return await this.call(options);
    };
}

const wallet = new Wallet();

module.export = wallet;
