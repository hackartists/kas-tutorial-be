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

    async sendTrasfer(from, to, amount) {
        const peb = caver.utils.convertToPeb(amount, 'KLAY');
        const hexpeb = caver.utils.numberToHex(peb);

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
