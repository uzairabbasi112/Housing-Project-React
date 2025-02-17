const express = require('express');
const Producer = require('../models/producer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Make sure to import bcrypt if you hash passwords

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; // Set the user details in request object
        next();
    });
};

// Login route for producers
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find producer by email
        const producer = await Producer.findOne({ email });
        if (!producer) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check password (assuming it’s hashed)
        const isMatch = await bcrypt.compare(password, producer.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: producer._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
        
        // Return token and producer details
        res.status(200).json({ 
            message: "Login successful", 
            token, 
            producer: {
                id: producer._id, 
                name: producer.name,
                email: producer.email,
                category: producer.Category,
                address: producer.Address,
                number: producer.Number,
                rating: producer.Rating
            } 
        });

    } catch (err) {
        console.error("Error logging in producer:", err);
        res.status(500).send({ error: "An error occurred while logging in." });
    }
});

// Fetch producers route
router.get('/', async (req, res) => {
    try {
        const producers = await Producer.find({});
        res.json(producers);
    } catch (err) {
        console.error("Error fetching producers:", err);
        res.status(500).send({ error: "An error occurred while fetching producers." });
    }
});

// Route to get producer details using token
router.get('/user-details', authenticateToken, async (req, res) => {
    try {
        const producer = await Producer.findById(req.user.id); // Adjust according to how you store the producer ID in the token
        if (!producer) {
            return res.status(404).json({ message: "Producer not found" });
        }
        res.status(200).json({ producer });
    } catch (error) {
        console.error("Error fetching producer details:", error);
        res.status(500).json({ message: "An error occurred while fetching producer details." });
    }
});

module.exports = router;
