const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { create } = require('domain');

const userSchema = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true, lowercase: true },
    password: { type: String, require: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

//Хеширование пароля
userSchema.pre('save', async function (next) {
    if (!this.isModiFide('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Проверка пароля
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
