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

    async updateAccountToMultisig(from, ownerPublicKey, publicKeys) {
        const threshold = publicKeys.length;
        const weightedKeys = [
            { publicKey: ownerPublicKey, weight: threshold },
        ].concat(
            Array.from(publicKeys, function (el) {
                return {
                    publicKey: el,
                    weight: 1,
                };
            }),
        );

        const options = {
            method: 'PUT',
            url: '/v2/account/${from}/multisig',
            body: {
                threshold: threshold,
                weightedKeys: weightedKeys,
            },
            json: true,
        };

        const res = await this.call(options);
        console.log(res);

        return res;
    }
}

const wallet = new Wallet();

module.exports = wallet;
