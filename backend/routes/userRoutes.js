// userRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { authenticateToken } = require('../middlewares/auth'); // Import the middleware

const router = express.Router();


// Register route
router.post('/register', async (req, res) => {
    const { name, email, password, age } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, age });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).send({ error: "An error occurred while registering the user." });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password does not match for User");
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ 
            message: "Login successful", 
            token, 
            user: {
                id: user._id, 
                name: user.name,
                email: user.email,
                age: user.age
            } 
        });
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).send({ error: "An error occurred while logging in." });
    }
});

// Fetch all users route
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).send({ error: "An error occurred while fetching users." });
    }
});

// Route to get user details using token
router.get('/user-details', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user: { name: user.name, email: user.email, age: user.age } });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "An error occurred while fetching user details." });
    }
});

module.exports = router;
