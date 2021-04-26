var express = require('express');
var router = express.Router();

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//     console.log('Time: ', Date.now());
//     next();
// });

router.post('/', (req, res) => {
    var address = '0x0000';
    // TODO: create an account API

    // TODO: save address, userid, password

    res.json({
        address: address,
        balance: 1000,
    });
});

router.get('/:user/klay', (req, res) => {
    // TODO: user to address

    // TODO: get balance API

    res.json({
        balance: 1000,
    });
});

router.post('/:user/klay', (req, res) => {
    console.log(req.body);
    var fromUser = req.body.from;
    var toUser = req.body.to;
    var klay = req.body.klay;

    // TODO: convert users to addresses

    // TODO: convert klay to peb

    var txHash = '';
    // TODO: send KLAY API

    // TODO: get receipt

    res.json({
        txHash,
    });
});

module.exports = router;
