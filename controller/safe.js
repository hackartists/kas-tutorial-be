const express = require('express');
var router = express.Router();
const wallet = require('../service/kas/wallet');
const conv = require('../utils/conv');

router.post('/', async (req, res) => {
    // TODO: create an account
    const account = await wallet.createAccount();
    console.log(account);

    // TODO: send klay from a creator to created one.
    const creator = await conv.userToAddress(req.body.creator);
    const txHash = await wallet.sendTrasfer(creator, account.address, 1);
    console.log(txHash);

    // TODO: confirm tx receipt.
    await sleep(3000);

    // TODO: update the created account to multisig with invited and creator.


    res.json({});
});
