const express = require('express');
var router = express.Router();
const wallet = require('../service/kas/wallet');
const kip17 = require('../service/kas/kip17');
const conv = require('../utils/conv');
const time = require('../utils/time');
const SafeMoney = require('../model/safe');

router.post('/', async (req, res) => {
    // TODO: create an account
    const account = await wallet.createAccount();
    console.log(account);

    // TODO: send klay from a creator to created one.
    const creator = await conv.userToAccount(req.body.creator);
    const txHash = await wallet.sendTrasfer(
        creator.address,
        account.address,
        1,
    );
    console.log(txHash);

    // TODO: confirm tx receipt.
    await time.sleep(3000);

    // TODO: conversion user to publickey.
    const pubkeys = [];
    for (const el in req.body.invitees) {
        const acc = await conv.userToAccount(el);
        pubkeys.push(acc.publicKey);
    }

    // TODO: update the created account to multisig with invited and creator.
    var result = await wallet.updateAccountToMultisig(
        account.address,
        creator.publicKey,
        pubkeys,
    );
    console.log(result);

    // TODO: transfer token to updated address.
    result = await kip17.sendToken(
        creator.address,
        req.body.warrant,
        account.address,
    );
    console.log(result);

    const ret = {
        name: req.body.name,
        creator: req.body.creator,
        address: account.address,
        publicKey: account.publicKey,
        tokenId: req.body.warrant,
        image: req.body.image,
        attendees: [creator.name].concat(req.body.invitees),
    };
    const safeMoney = new SafeMoney(ret);
    result = await safeMoney.save();
    console.log(result);

    res.json(ret);
});

router.get('/:user', async (req, res) => {
    const safes = await SafeMoney.find({attendees: req.params.user});

    res.json(safes);
});

module.exports = router;
