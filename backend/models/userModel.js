const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, min: 0 },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;