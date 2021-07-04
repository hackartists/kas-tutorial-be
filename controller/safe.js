const express = require('express');
var router = express.Router();
const wallet = require('../service/kas/wallet');
const kip17 = require('../service/kas/kip17');
const node = require('../service/kas/node');
const conv = require('../utils/conv');
const time = require('../utils/time');
const Safe = require('../model/safe');

router.post('/', async (req, res) => {
    const account = await wallet.createAccount();

    const creator = await conv.userToAccount(req.body.creator);

    const txHash = await wallet.sendTransfer(
        creator.address,
        account.address,
        1,
    );

    for (var i = 0; i < 3; i++) {
        await time.sleep(1000);
        const res = await node.getReceipt(txHash);
        if (res) break;
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

    await kip17.sendToken(creator.address, req.body.warrant, account.address);

    const ret = {
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

router.get('/:user', async (req, res) => {
    const safes = await Safe.find({ attendees: req.params.user });

    res.json(safes);
});

// TODO: send card API
router.post('/:safe/token/:token', async (req, res) => {
    const safeAddress = req.params.safe;
    const tokenId = req.params.token;
    const toUser = req.body.to;
    const fromUser = req.body.from;
    const to = await conv.userToAddress(toUser);
    const from = await conv.userToAddress(fromUser);
    const result = await kip17.sendToken(safeAddress, tokenId, to);
    console.log(result);
    if (result.transactionHash) {
        res.json({ transactionHash: result.transactionHash });
        return;
    }
    await wallet.signMultisigTransaction(from, result.transactionId);

    const safe = await Safe.findOne({ address: safeAddress });
    if (!safe.pendings) {
        safe.pendings = {};
    }

    safe.pendings[tokenId] = {
        txid: result.transactionId,
        to: toUser,
    };
    console.log(safe);
    safe.markModified('pendings');
    await safe.save();

    await wallet.signMultisigTransaction(from, result.transactionId);

    res.json({ transactionId: result.transactionId });
});

// TODO: sign multisig transaction API
router.post('/:safe/:token/sign', async (req, res) => {
    const transactionId = req.body.transactionId;
    const userId = req.body.userId;
    const address = await conv.userToAddress(userId);
    const safeAddress = req.params.safe;
    const tokenId = req.params.token;

    const result = await wallet.signMultisigTransaction(address, transactionId);

    if (result.status === 'Submitted') {
        const doc = await Safe.findOne({ address: safeAddress });
        delete doc.pendings[tokenId];
        console.log(doc.pendings);

        doc.markModified('pendings');
        await doc.save();
    }

    res.json({ status: 'ok' });
});

module.exports = router;
