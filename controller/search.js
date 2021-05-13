const express = require('express');
const User = require('../model/user');
const Safe = require('../model/safe');
var router = express.Router();

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//     console.log('Time: ', Date.now());
//     next();
// });

router.get('', async (req, res) => {
    console.log(req.query);
    var pattern = req.query['user-pattern'];

    const doc = await User.find(
        { name: { $regex: `^${pattern}`, $options: 'i' } },
        'name',
    );
    const doc2 = await Safe.find(
        { name: { $regex: `^${pattern}`, $options: 'i' } },
        'name',
    );

    const users = [];
    doc.forEach((e) => users.push(e.name));
    doc2.forEach((e) => users.push(e.name));

    res.json({
        users,
    });
});

module.exports = router;
