const express = require('express');
var router = express.Router();
const wallet = require('../service/kas/wallet');
const kip17 = require('../service/kas/kip17');
const node = require('../service/kas/node');
const conv = require('../utils/conv');
const time = require('../utils/time');
const Safe = require('../model/safe');

// TODO: create safe API
router.post('/', async (req, res) => {
    const account = await wallet.createAccount();

    const creator = await conv.userToAccount(req.body.creator);
    const txHash = await wallet.sendTransfer(
        creator.address,
        account.address,
        1,
    );

    var ret;
    for (var i = 0; i < 3; i++) {
        await time.sleep(1000);
        ret = await node.getReceipt(txHash);
        if (ret) break;
    }
    if (!ret) {
        res.json({ code: -1, message: 'failed to send balance' });
        return;
    }

    const pubkeys = [];

    for (const el of req.body.invitees.split(' ')) {
        const acc = await conv.userToAccount(el);
        pubkeys.push(acc.publicKey);
    }

    await wallet.updateAccountToMultisig(
        account.address,
        creator.publicKey,
        pubkeys,
    );

    for (var i = 0; i < 3; i++) {
        await time.sleep(1000);
        ret = await node.getReceipt(txHash);
        if (ret) break;
    }
    if (!ret) {
        res.json({ code: -2, message: 'failed to create multisig account' });
        return;
    }

    await kip17.sendToken(creator.address, req.body.warrant, account.address);

    ret = {
        name: req.body.name,
        creator: req.body.creator,
        address: account.address,
        publicKey: account.publicKey,
        tokenId: req.body.warrant,
        image: req.body.image,
        attendees: [creator.name].concat(req.body.invitees),
    };
    const safeMoney = new Safe(ret);
    await safeMoney.save();

    res.json(ret);
});

// TODO: list safes API
router.get('/:user', async (req, res) => {
    const safes = await Safe.find({ attendees: req.params.user });

    res.json(safes);
});

module.exports = router;
