const ApiCaller = require('./api_caller');

class TokenHistory extends ApiCaller {
    constructor() {
        super('https://th-api.klaytnapi.com');
    }

    async klayHistory(address, starttime, endtime) {
        const options = {
            method: 'GET',
            url: `/v2/transfer/account/${address}`,
            qs: {
                kind: 'klay',
            },
        };
        if (starttime && endtime) {
            options.qs.range =  `${starttime},${endtime}`;
        }

        var res = await this.call(options);
        console.log(res);
        const history = [...res.items];

        while (res.cursor != '') {
            options.qs.cursor = res.cursor;
            res = await this.call(options);
            history.push(...res.items);
        }

        return history;
    }
}

const th = new TokenHistory();

module.exports = th;
