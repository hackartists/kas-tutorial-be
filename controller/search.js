const express = require('express');
const User = require('../model/user');
var router = express.Router();

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//     console.log('Time: ', Date.now());
//     next();
// });

router.get('', (req, res) => {
    console.log(req.query);
    var pattern = req.query['user-pattern'];

    const users = User.find({ name: { $regex: `^${pattern}`, $options: 'i' } });
    res.json({
        users,
    });
});

module.exports = router;
