var express = require('express');
var router = express.Router();

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//     console.log('Time: ', Date.now());
//     next();
// });

router.get('', (req, res) => {
    console.log(req.query);
    var pattern = req.params['user-pattern'];

    // TODO: find address from mongo

    res.json({
        users: ['test', 'luffy'],
    });
});

module.exports = router;
