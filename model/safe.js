var mongoose = require('mongoose');

const safeMoneySchema = new mongoose.Schema({
    name: String,
    address: String,
    publicKey: String,
    image: String,
    tokenId: String,
    creator: String,
    attendees: Array,
    pendings: Object,
});

const SafeMoney = mongoose.model('SafeMoney', safeMoneySchema);

module.exports = SafeMoney;
