const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Статистика продаж
exports.getStats = async (req, res) => {
    try {
        // Общая статистика
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'user' });

        // Общая сумма заказов
        const revenueResult = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        // Топ товаров по продажам
        const topProducts = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    name: { $first: '$items.name' },
                    totalSold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        // Заказы по статусам
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            totalOrders,
            totalUsers,
            totalRevenue,
            topProducts,
            ordersByStatus
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
