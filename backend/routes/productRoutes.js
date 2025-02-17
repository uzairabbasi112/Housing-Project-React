const express = require('express');
const Product = require('../models/product');
const multer = require('multer');
const router = express.Router();

// Fetch all products route
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send({ error: "An error occurred while fetching products." });
    }
});

// Fetch product by ID route
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id); // Find product by ID
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).send({ error: "An error occurred while fetching the product." });
    }
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './product_uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

router.post('/', upload.array('Images_path', 5), async (req, res) => {
    try {
        const { name, title, category, description, rating, price } = req.body;
        const imagePaths = req.files.map((file) => file.path);

        const newProduct = new Product({
            Name: name,           // Match the field names used in frontend
            Title: title,
            Category: category,
            Description: description,
            Rating: rating || 0,  // Default to 0 if rating isn't provided
            Price: price || 0,    // Default to 0 if price isn't provided
            Images_path: imagePaths, // Match field name for image paths
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: savedProduct });
    } catch (error) {
        console.error('Error creating product:', error.message);
        res.status(500).json({ error: 'Failed to create product' });
    }
});



module.exports = router;
