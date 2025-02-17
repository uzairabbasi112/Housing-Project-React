const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    Title: { type: String, required: true }, // Title of the product
    Category: { type: String, required: true }, // Product category
    Rating: { type: Number, required: true }, // Rating (e.g., 1-5)
    Producer: { type: mongoose.Schema.Types.ObjectId, ref: 'Producer' }, // Producer as ObjectId reference (if applicable)
    Description: { type: String, required: true }, // Description of the product
    Name: { type: String, required: true }, // Name of the product
    Images_path: { type: [String], required: true }, // Array of image paths
    Price: { type: Number, required: true } // Price of the product
}, { collection: 'Products' }); // Define the collection name as 'Products'

module.exports = mongoose.model('Product', productSchema);
