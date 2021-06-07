const express = require('express');
const User = require('../model/user');
const Safe = require('../model/safe');
var router = express.Router();

router.get('', async (req, res) => {
    var pattern = req.query['user-pattern'];

    const doc = await User.find(
        { name: { $regex: `^${pattern}`, $options: 'i' } },
        'name',
    );

    const users = [];
    doc.forEach((e) => users.push(e.name));

    // TODO: adds safes to search queries.
    const doc2 = await Safe.find(
        { name: { $regex: `^${pattern}`, $options: 'i' } },
        'name',
    );
    doc2.forEach((e) => users.push(e.name));

    res.json({
        users,
    });
});

module.exports = router;
