var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    address: String,
    password: String,
    publicKey: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
