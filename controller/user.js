const express = require('express');
const User = require('../model/user');
const wallet = require('../service/kas/wallet');
const node = require('../service/kas/node');
const conv = require('../utils/conv');
var router = express.Router();

router.post('/', async (req, res) => {
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

// TODO: get KLAY API implementation
router.get('/:user/klay', async (req, res) => {
    const address = await conv.userToAddress(req.params.user);
    const balance = await node.getBalance(address);

    res.json({
        balance,
    });
});

module.exports = router;
