const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Генерация токена
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '30d' }
    );
};

// Регистрация
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email уже используется' });
        }

        const user = await User.create({ name, email, password });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Авторизация
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                message: 'Неверный email или пароль'
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get профиль
exports.getProfile = async (req, res) => {
    res.json(req.user);
};

// Update профиль
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, phone, address },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
