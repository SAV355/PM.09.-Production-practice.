const Order = require('../models/Order');

// Создать заказ
exports.createOrder = async (req, res) => {
    try {
        const {
            contactInfo, items,
            deliveryType, paymentType
        } = req.body;

        const totalPrice = items.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        const order = await Order.create({
            user: req.user?._id,
            contactInfo,
            items,
            totalPrice,
            deliveryType,
            paymentType
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Получить заказы пользователя
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order
            .find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Получить все заказы (только админ)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order
            .find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Обновить статус заказа (только админ)
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
