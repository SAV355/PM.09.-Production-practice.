const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Название товара обязательно'],
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    images: [{ type: String }],
    characteristics: [{
        key: { type: String },
        value: { type: String }
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    isRecommended: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Потекстовый поиск
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
