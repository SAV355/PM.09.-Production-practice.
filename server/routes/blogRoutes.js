const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Запрос получения последней статьи
router.get('/', async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const posts = await Blog
            .find()
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Получить статью
router.get('/:id', async (req, res) => {
    try {
        const post = await Blog.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Статья не найдена' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Создать статью (админ)
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const post = await Blog.create(req.body);
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
