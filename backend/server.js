require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const producerRoutes = require('./routes/producerRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');


const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Serve static files from the 'product_uploads' directory
app.use('/product_uploads', express.static('product_uploads'));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/uzair_work?authSource=admin';

const connectWithRetry = () => {
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => {
        console.error("Failed to connect to MongoDB:", err);
        setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

// Use Routes
app.use('/users', userRoutes);
app.use('/producers', producerRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Listen on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
