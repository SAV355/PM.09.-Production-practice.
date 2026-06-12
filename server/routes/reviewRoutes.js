const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const { protect } = require("../middleware/authMiddleware");

// Получить отзывы товара
router.get("/product/:productId", async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate("user", "name")
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Добавить отзыв
router.post("/", protect, async (req, res) => {
    try {
        const { productId, rating, text } = req.body;

        // Проверка: один отзыв на товар от пользователя
        const existing = await Review.findOne({
            product: productId,
            user: req.user._id,
        });
        if (existing) {
            return res.status(400).json({
                message: "Вы уже оставляли отзыв на этот товар",
            });
        }

        const review = await Review.create({
            product: productId,
            user: req.user._id,
            rating,
            text,
        });

        const populated = await review.populate("user", "name");
        res.status(201).json(populated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
