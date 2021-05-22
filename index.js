const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const user = require('./controller/user');
// TODO: imports search controller
const search = require('./controller/search');

mongoose.connect('mongodb://mongo.kas-tutorial:27017/kas-tutorial', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/v1/user', user);
// TODO: adds search route
app.use('/v1/search', search);

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:3000`);
});
