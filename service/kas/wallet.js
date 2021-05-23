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

    async updateAccountToMultisig(from, ownerPublicKey, publicKeys) {
        const threshold = publicKeys.length + 1;
        const weightedKeys = [{ publicKey: ownerPublicKey, weight: 1 }].concat(
            Array.from(publicKeys, function (el) {
                return {
                    publicKey: el,
                    weight: 1,
                };
            }),
        );
        console.log(weightedKeys);

        const options = {
            method: 'PUT',
            url: `/v2/account/${from}/multisig`,
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

    async getMultisigTransactions(address) {
        const options = {
            method: 'GET',
            url: `/v2/multisig/account/${address}/tx`,
            qs: { size: '100' },
        };

        const res = await this.call(options);
        console.log(res);

        return res;
    }

    async signMultisigTransaction(address, transactionId) {
        console.log(`/v2/multisig/account/${address}/tx/${transactionId}/sign`);
        const options = {
            method: 'POST',
            url: `/v2/multisig/account/${address}/tx/${transactionId}/sign`,
        };

        const res = await this.call(options);
        console.log(res);

        return res;
    }
}

const wallet = new Wallet();

module.exports = wallet;
