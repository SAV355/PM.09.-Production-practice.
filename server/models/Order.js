const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Контактная информация
    contactInfo: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true }
    },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    deliveryType: {
        type: String,
        enum: ['courier', 'pickup', 'post'],
        required: true
    },
    paymentType: {
        type: String,
        enum: ['cash', 'card'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    orderNumber: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now }
});

// Генерация номера заказа
orderSchema.pre('save', function (next) {
    if (!this.orderNumber) {
        this.orderNumber = 'ORD-' + Date.now() + '-' +
            Math.floor(Math.random() * 1000);
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
