const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, min: 0 },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now }
}, { collection: 'Users' });

module.exports = mongoose.model('User', userSchema);
