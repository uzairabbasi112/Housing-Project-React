const mongoose = require('mongoose');

const producerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    Store: { type: String, required: true },
    Category: { type: String, required: true },
    Address: { type: String, required: true },
    Number: { type: String },
    Rating: { type: Number },
    email: { type: String, required: true, unique: true }, // Added email field
    password: { type: String, required: true } // Added password field
}, { collection: 'Producers' });

module.exports = mongoose.model('Producer', producerSchema);
