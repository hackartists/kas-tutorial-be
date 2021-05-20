const caver = require('caver-js');
const ApiCaller = require('./api_caller');

class Wallet extends ApiCaller {
    constructor() {
        super('https://wallet-api.klaytnapi.com');
    }

    async createAccount() {
        const options = {
            method: 'POST',
            url: '/v2/account',
            json: true,
        };

        return await this.call(options);
    }
}

const wallet = new Wallet();

module.exports = wallet;
