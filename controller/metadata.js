const express = require('express');
const Metadata = require('../model/metadata');
var router = express.Router();

// TODO: /v1/metadata/:id API
router.get('/:id', async (req, res) => {
    console.log(req.params.id);
    const id = req.params.id.replace(/^0x/, '');
    console.log(id);
    const doc = await Metadata.findById(id);
    console.log(doc);

    res.json({
        tokenId: req.params.id,
        name: doc.name,
        kind: doc.kind,
        image: doc.image,
        description: doc.description,
    });
});

module.exports = router;
