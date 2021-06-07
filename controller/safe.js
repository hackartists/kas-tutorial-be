const express = require('express');
var router = express.Router();
const wallet = require('../service/kas/wallet');
const kip17 = require('../service/kas/kip17');
const conv = require('../utils/conv');
const time = require('../utils/time');
const SafeMoney = require('../model/safe');

router.post('/', async (req, res) => {
    const account = await wallet.createAccount();

    const creator = await conv.userToAccount(req.body.creator);
    const txHash = await wallet.sendTrasfer(
        creator.address,
        account.address,
        1,
    );

    await time.sleep(3000);

    const pubkeys = [];

    for (const el of req.body.invitees.split(' ')) {
        const acc = await conv.userToAccount(el);
        pubkeys.push(acc.publicKey);
    }

    var result = await wallet.updateAccountToMultisig(
        account.address,
        creator.publicKey,
        pubkeys,
    );

    result = await kip17.sendToken(
        creator.address,
        req.body.warrant,
        account.address,
    );

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

    res.json(ret);
});

router.get('/:user', async (req, res) => {
    const safes = await SafeMoney.find({ attendees: req.params.user });

    res.json(safes);
});

router.post('/:safe/:token/sign', async (req, res) => {
    const transactionId = req.body.transactionId;
    const userId = req.body.userId;
    const address = await conv.userToAddress(userId);
    const safeAddress = req.params.safe;
    const tokenId = req.params.token;

    const response = await wallet.signMultisigTransaction(
        address,
        transactionId,
    );

    const doc = await SafeMoney.findOne({ address: safeAddress });
    delete doc.pendings[tokenId];
    const result = await doc.save();

    res.json(result);
});

module.exports = router;
