const express = require('express');
const multer = require('multer');
const conv = require('../utils/conv');
const Metadata = require('../model/metadata');
const Safe = require('../model/safe');
const kip17 = require('../service/kas/kip17');
const wallet = require('../service/kas/wallet');
var router = express.Router();

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        var filetype = file.originalname.substring(
            file.originalname.length - 3,
        );
        cb(null, 'image-' + Date.now() + '.' + filetype);
    },
});
var upload = multer({ storage: storage });
router.post('/:user/issue', upload.single('file'), async function (
    req,
    res,
    next,
) {
    console.log(req.body);
    console.log(req.params);
    if (!req.file) {
        res.status(500);
        return next(err);
    }
    const img = '/images/' + req.file.filename;
    const meta = JSON.stringify({
        name: req.body.name,
        kind: req.body.kind,
        image: img,
    });
    const metadata = new Metadata({
        name: req.body.name,
        kind: req.body.kind,
        image: img,
    });
    const doc = await metadata.save();
    console.log(doc);
    const id = '0x' + doc._id.toString();
    // const uri = `/v1/metadata/${id}`;
    const address = await conv.userToAddress(req.params.user);

    await kip17.issueToken(address, id, meta);

    res.json({ metadata: doc._id.toString() });
});

router.get('/:user/token', async (req, res) => {
    const user = req.params.user;
    const address = await conv.userToAddress(user);

    const tokens = await kip17.listTokens(address);

    res.json(tokens);
});

router.post('/:user/token/:token', async (req, res) => {
    const user = req.params.user;
    const tokenId = req.params.token;
    const toUser = req.body.to;
    console.log(user, tokenId, toUser);
    const address = await conv.userToAddress(user);
    const to = await conv.userToAddress(toUser);
    const result = await kip17.sendToken(address, tokenId, to);

    if (user.startsWith('0x')) {
        const txs = await wallet.getMultisigTransactions(user);
        for (const tx of txs.items) {
            if (tx.txData.input.includes(tokenId.substring(2))) {
                console.log(tx.transactionId);
                const safe = await Safe.findOne({ address: user });
                if (!safe.pendings) {
                    safe.pendings = {};
                }

                safe.pendings[tokenId] = {
                    txid: tx.transactionId,
                    to: toUser,
                };
                const result = await safe.save();
                console.log(result);
                break;
            }
        }
    }

    res.json(result);
});

module.exports = router;
