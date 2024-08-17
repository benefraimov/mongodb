const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String },
    age: { type: Number, min: 0 },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;