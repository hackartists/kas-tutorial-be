const express = require('express');
const User = require('../model/user');
const wallet = require('../service/kas/wallet');
const node = require('../service/kas/node');
const th = require('../service/kas/th');
const caver = require('caver-js');
const conv = require('../utils/conv');
var router = express.Router();

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//     console.log('Time: ', Date.now());
//     next();
// });

router.post('/', async (req, res) => {
    const address = await conv.userToAddress(req.body.username);
    if (address !== '') {
        res.json({ address });
        return;
    }
    const account = await wallet.createAccount();
    console.log(account);
    const user = new User({
        name: req.body.username,
        password: req.body.password,
        address: account.address,
        publicKey: account.publicKey,
    });

    user.save((err, doc) => {
        if (err) console.error(err);
        console.log(doc);
    });

    res.json({
        address: account.address,
    });
});

router.get('/:user/klay', async (req, res) => {
    const address = await conv.userToAddress(req.params.user);
    const balance = await node.getBalance(address);
    res.json({
        balance,
    });
});

router.get('/:user/klay/transfer-history', async (req, res) => {
    const address = await conv.userToAddress(req.params.user);
    const starttime = req.query['start-timestamp'];
    const endtime = req.query['end-timestamp'];

    const history = await th.klayHistory(address, starttime, endtime);
    const ret = [];
    for (const el of history) {
        const klay = caver.utils.convertFromPeb(
            caver.utils.hexToNumberString(el.value),
            'KLAY',
        );

        const item = {
            value: klay,
            timestamp: el.timestamp,
        };
        let target = '';

        if (caver.utils.toChecksumAddress(el.from) === address) {
            item.eventType = 'sent';
            target = el.to;
        } else {
            item.eventType = 'received';
            target = el.from;
        }

        const targetuser = await conv.addressToUser(target);

        item.target = targetuser !== '' ? targetuser : target;
        ret.push(item);
    }

    res.json(ret);
});

router.post('/:user/klay', async (req, res) => {
    const from = await conv.userToAddress(req.params.user);
    const to = await conv.userToAddress(req.body.to);
    const amount = req.body.amount;
    console.log(from, to, amount);

    const txHash = await wallet.sendTrasfer(from, to, amount);

    res.json({
        txHash,
    });
});

module.exports = router;
