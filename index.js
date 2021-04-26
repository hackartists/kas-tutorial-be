const bodyParser = require('body-parser');
const express = require('express');
var user = require('./controller/user');
var search = require('./controller/search');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/v1/user', user);
app.use('/v1/search', search);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
