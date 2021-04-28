const express = require('express');
const User = require('../model/user');
const wallet = require('../service/kas/wallet');
const node = require('../service/kas/node');
var router = express.Router();

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//     console.log('Time: ', Date.now());
//     next();
// });

router.post('/', async (req, res) => {
    var address = '0x0000';

    // TODO: create an account API
    console.log(wallet)
    const account = await wallet.createAccount();

    // TODO: save address, userid, password
    const user = new User({
        name: req.body.username,
        password: req.body.password,
        address: account.address,
    });
    user.save((err, _doc) => {
        if (err) console.error(err);
        console.log(_doc);
    });

    res.json({
        address,
    });
});

router.get('/:user/klay', async (req, res) => {
    // TODO: user to address
    const user = await User.findOne({ name: req.params.user });
    console.log(user);
    const address = user.address;

    // TODO: get balance API
    const balance = node.getBalance(address);
    res.json({
        balance,
    });
});

router.post('/:user/klay', (req, res) => {
    console.log(req.body);
    var fromUser = req.body.from;
    var toUser = req.body.to;
    var klay = req.body.klay;

    // TODO: convert users to addresses

    // TODO: convert klay to peb

    var txHash = '0x1';
    // TODO: send KLAY API

    // TODO: get receipt

    res.json({
        txHash,
    });
});

module.exports = router;
