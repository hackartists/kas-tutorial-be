var mongoose = require('mongoose');

const metadataSchema = new mongoose.Schema({
    name: String,
    kind: String,
    image: String,
});

const Metadata = mongoose.model('Metadata', metadataSchema);

module.exports = Metadata;
