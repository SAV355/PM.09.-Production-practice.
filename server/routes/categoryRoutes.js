const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Category = require('../models/Category');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ═══════════════════════════════════════════════════════════
// GET /api/categories
// Получить все категории
// Публичный
// ═══════════════════════════════════════════════════════════
router.get('/', async (req, res) => {
    try {
        const categories = await Category
            .find()
            .sort({ name: 1 });

        // Для каждой категории считаем количество товаров
        const categoriesWithCount = await Promise.all(
            categories.map(async (cat) => {
                const productCount = await Product.countDocuments({
                    category: cat._id,
                });
                return {
                    ...cat.toObject(),
                    productCount,
                };
            })
        );

        res.json(categoriesWithCount);
    } catch (error) {
        console.error('Ошибка получения категорий:', error);
        res.status(500).json({
            message: 'Ошибка сервера при получении категорий',
        });
    }
});

// ═══════════════════════════════════════════════════════════
// GET /api/categories/:id
// Получить одну категорию по ID или slug
// Публичный
// ═══════════════════════════════════════════════════════════
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Ищем по _id или по slug
        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const category = isObjectId
            ? await Category.findById(id)
            : await Category.findOne({ slug: id });

        if (!category) {
            return res.status(404).json({
                message: 'Категория не найдена',
            });
        }

        // Считаем количество товаров в категории
        const productCount = await Product.countDocuments({
            category: category._id,
        });

        res.json({
            ...category.toObject(),
            productCount,
        });
    } catch (error) {
        console.error('Ошибка получения категории:', error);
        res.status(500).json({
            message: 'Ошибка сервера при получении категории',
        });
    }
});

// ═══════════════════════════════════════════════════════════
// POST /api/categories
// Создать категорию
// Только админ
// ═══════════════════════════════════════════════════════════
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { name, description, image } = req.body;

        // Проверка обязательных полей
        if (!name || !name.trim()) {
            return res.status(400).json({
                message: 'Название категории обязательно',
            });
        }

        // Генерация slug из названия
        const slug = name
            .trim()
            .toLowerCase()
            .replace(/[а-яёА-ЯЁ]/g, (char) => {
                const ru = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
                const en = 'abvgdeyozhziyklmnoprstufhtschshcyeyuya';
                const idx = ru.indexOf(char.toLowerCase());
                return idx >= 0 ? en[idx] : char;
            })
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        // Проверка уникальности slug
        const existingBySlug = await Category.findOne({ slug });
        if (existingBySlug) {
            return res.status(400).json({
                message: `Категория с таким названием уже существует`,
            });
        }

        // Проверка уникальности имени
        const existingByName = await Category.findOne({
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
        });
        if (existingByName) {
            return res.status(400).json({
                message: 'Категория с таким названием уже существует',
            });
        }

        const category = await Category.create({
            name: name.trim(),
            slug,
            description: description?.trim() || '',
            image: image?.trim() || '',
        });

        res.status(201).json(category);
    } catch (error) {
        console.error('Ошибка создания категории:', error);

        // Дублирование ключа MongoDB
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Категория с таким названием уже существует',
            });
        }

        res.status(500).json({
            message: 'Ошибка сервера при создании категории',
        });
    }
});

// ═══════════════════════════════════════════════════════════
// PUT /api/categories/:id
// Обновить категорию
// Только админ
// ═══════════════════════════════════════════════════════════
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Некорректный ID категории',
            });
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                message: 'Категория не найдена',
            });
        }

        const { name, description, image } = req.body;

        // Если меняется название — проверяем уникальность
        if (name && name.trim() !== category.name) {
            const existing = await Category.findOne({
                name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
                _id: { $ne: id },
            });
            if (existing) {
                return res.status(400).json({
                    message: 'Категория с таким названием уже существует',
                });
            }

            // Обновляем slug при смене названия
            category.slug = name
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');

            category.name = name.trim();
        }

        if (description !== undefined)
            category.description = description.trim();
        if (image !== undefined)
            category.image = image.trim();

        const updated = await category.save();

        // Считаем количество товаров
        const productCount = await Product.countDocuments({
            category: updated._id,
        });

        res.json({ ...updated.toObject(), productCount });
    } catch (error) {
        console.error('Ошибка обновления категории:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Категория с таким названием уже существует',
            });
        }

        res.status(500).json({
            message: 'Ошибка сервера при обновлении категории',
        });
    }
});

// ═══════════════════════════════════════════════════════════
// DELETE /api/categories/:id
// Удалить категорию
// Только админ
// ═══════════════════════════════════════════════════════════
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Некорректный ID категории',
            });
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                message: 'Категория не найдена',
            });
        }

        // Проверяем — есть ли товары в этой категории
        const productCount = await Product.countDocuments({
            category: id,
        });

        if (productCount > 0) {
            return res.status(400).json({
                message: `Нельзя удалить категорию — в ней ${productCount} товар(ов). Сначала удалите или переместите товары.`,
            });
        }

        await category.deleteOne();

        res.json({
            message: `Категория «${category.name}» успешно удалена`,
            id,
        });
    } catch (error) {
        console.error('Ошибка удаления категории:', error);
        res.status(500).json({
            message: 'Ошибка сервера при удалении категории',
        });
    }
});

module.exports = router;
