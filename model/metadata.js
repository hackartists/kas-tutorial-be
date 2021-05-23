var mongoose = require('mongoose');

// TODO: metadata schema
const metadataSchema = new mongoose.Schema({
    name: String,
    description: String,
    kind: String,
    image: String,
});

const Metadata = mongoose.model('Metadata', metadataSchema);

module.exports = Metadata;
