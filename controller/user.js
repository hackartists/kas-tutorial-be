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
    // TODO: create an account API
    const account = await wallet.createAccount();

    // TODO: save address, userid, password
    const user = new User({
        name: req.body.username,
        password: req.body.password,
        address: account.address,
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
    const address = await userToAddress(req.params.user);

    // TODO: get balance API
    const balance = await node.getBalance(address);
    res.json({
        balance,
    });
});

router.post('/:user/klay', async (req, res) => {
    const from = await userToAddress(req.params.user);
    const to = await userToAddress(req.body.to);
    const amount = req.body.amount;
    console.log(from, to, amount);

    // TODO: send KLAY API
    const txHash = await wallet.sendTrasfer(from, to, amount);

    res.json({
        txHash,
    });
});

async function userToAddress(userid) {
    const user = await User.findOne({ name: userid });

    return user.address;
}

module.exports = router;
