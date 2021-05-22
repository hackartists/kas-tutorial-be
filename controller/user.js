const express = require('express');
const User = require('../model/user');
const wallet = require('../service/kas/wallet');
const node = require('../service/kas/node');
const conv = require('../utils/conv');
var router = express.Router();

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//     console.log('Time: ', Date.now());
//     next();
// });

router.post('/', async (req, res) => {
    const account = await wallet.createAccount();

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
