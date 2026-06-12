const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// После сохранения отзыва — пересчёт рейтинга товара
reviewSchema.post('save', async function () {
    const Product = mongoose.model('Product');
    const reviews = await mongoose.model('Review')
        .find({ product: this.product });

    const avgRating = reviews.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await Product.findByIdAndUpdate(this.product, {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length
    });
});

module.exports = mongoose.model('Review', reviewSchema);
