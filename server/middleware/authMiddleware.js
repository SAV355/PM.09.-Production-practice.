const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Проверка авторизации
exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Не авторизован' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ message: 'Пользователь не найден' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Токен недействителен' });
    }
};

// Проверка администратора
exports.adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Доступ запрещён' });
    }
};
