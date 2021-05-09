const express = require('express');
const multer = require('multer');
var router = express.Router();
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        console.log(file);
        var filetype = file.originalname.substring(file.originalname.length - 3);
        if (file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    },
});
var upload = multer({ storage: storage });
router.post('/:user/issue', upload.single('file'), function(req, res, next) {
    console.log(req.file);
    console.log(req.body);
    if (!req.file) {
        res.status(500);
        return next(err);
    }
    res.json({ uri: '/images/' + req.file.filename });
});

module.exports = router;
