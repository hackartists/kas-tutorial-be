const express = require('express');
const multer = require('multer');
const conv = require('../utils/conv');
const Metadata = require('../model/metadata');
const Safe = require('../model/safe');
const kip17 = require('../service/kas/kip17');
const wallet = require('../service/kas/wallet');
const endpoint = 'http://10.1.1.2:3000';
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
    const img = endpoint + '/images/' + req.file.filename;

    const metadata = new Metadata({
        name: req.body.name,
        description: req.body.kind,
        kind: req.body.kind,
        image: img,
    });
    const doc = await metadata.save();
    const id = '0x' + doc._id.toString();
    const uri = `${endpoint}/v1/metadata/${id}`;
    const address = await conv.userToAddress(req.params.user);

    await kip17.issueToken(address, id, uri);

    res.json({ metadata: doc._id.toString() });
});

// TODO: GET /v1/asset/:user/token API
router.get('/:user/token', async (req, res) => {
    const user = req.params.user;
    const address = await conv.userToAddress(user);

    const tokens = await kip17.listTokens(address);

    res.json(tokens);
});

// TODO: POST /v1/asset/:user/token/:token API
router.post('/:user/token/:token', async (req, res) => {
    const user = req.params.user;
    const tokenId = req.params.token;
    const toUser = req.body.to;
    console.log(user, tokenId, toUser);
    const address = await conv.userToAddress(user);
    const to = await conv.userToAddress(toUser);
    const result = await kip17.sendToken(address, tokenId, to);

    res.json(result);
});

module.exports = router;
