const request = require('request');
const Caver = require('caver-js');
const caver = new Caver('https://your.en.url:8651/');

class Wallet {
    constructor() {
        this.endpoint = 'https://wallet-api.klaytnapi.com';
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

    async createAccount() {
        const options = {
            method: 'POST',
            url: '/v2/account',
        };

        return await this.call(options);
    }

    async sendTrasfer(from, to, amount) {
        // TODO: convert klay to peb
        const peb = caver.utils.convertToPeb(amount, 'KLAY');
        const hexpeb = caver.utils.numberToHex(peb);

        // TODO: send KLAY API
        const options = {
            method: 'POST',
            url: '/v2/tx/fd/value',
            body: {
                from: from,
                value: hexpeb,
                to: to,
                submit: true,
            },
            json: true,
        };

        const res = await this.call(options);
        console.log(res);

        return res.transactionHash;
    }
}

const wallet = new Wallet();

module.exports = wallet;
