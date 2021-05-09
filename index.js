const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const user = require('./controller/user');
const search = require('./controller/search');
const asset = require('./controller/asset');

mongoose.connect('mongodb://mongo.kas-tutorial:27017/kas-tutorial', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/v1/user', user);
app.use('/v1/search', search);
app.use('/v1/asset', asset);

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:3000`);
});
