const express = require('express');
const User = require('../model/user');
const wallet = require('../service/kas/wallet');
var router = express.Router();

router.post('/', async (req, res) => {
    // TODO: create an account API
    const account = await wallet.createAccount();
    console.log(account);

    // TODO: save address, userid, password
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

module.exports = router;
