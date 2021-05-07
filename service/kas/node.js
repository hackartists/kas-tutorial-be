const caver = require('caver-js');
const ApiCaller = require('./api_caller');

class Node extends ApiCaller {
    constructor() {
        super('https://node-api.klaytnapi.com');
    }

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
        let klay = '0';
        if (ret.result) {
            const peb = caver.utils.hexToNumberString(ret.result);
            klay = caver.utils.convertFromPeb(peb, 'KLAY');
        }

        return klay;
    }
}

const node = new Node();

module.exports = node;
