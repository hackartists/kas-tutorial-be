const caver = require('caver-js');
const ApiCaller = require('./api_caller');

class Node extends ApiCaller {
    constructor() {
        super('https://node-api.klaytnapi.com');
    }

    async rpcCall(method, params) {
        const options = {
            method: 'POST',
            url: '/v1/klaytn',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                id: 1,
                jsonrpc: '2.0',
                method,
                params,
            },
            json: true,
        };

        const ret = await this.call(options);

        return ret.result;
    }

    async getBalance(address) {
        const ret = await this.rpcCall('klay_getBalance', [address, 'latest']);
        let klay = '0';
        if (ret) {
            const peb = caver.utils.hexToNumberString(ret);
            klay = caver.utils.convertFromPeb(peb, 'KLAY');
        }

        return klay;
    }

    async getReceipt(txhash) {
        return await this.rpcCall('klay_getTransactionReceipt', [txhash]);
    }
}

const node = new Node();

module.exports = node;
