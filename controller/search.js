const express = require('express');
const User = require('../model/user');
var router = express.Router();

router.get('', async (req, res) => {
    console.log(req.query);
    var pattern = req.query['user-pattern'];

    const doc = await User.find(
        { name: { $regex: `^${pattern}`, $options: 'i' } },
        'name',
    );

    const users = [];
    doc.forEach((e) => users.push(e.name));

    res.json({
        users,
    });
});

module.exports = router;