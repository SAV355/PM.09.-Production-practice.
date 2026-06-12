const Product = require('../models/Product');

// Получить товары с фильтрацией/сортировкой
exports.getProducts = async (req, res) => {
    try {
        const {
            category, minPrice, maxPrice, minRating,
            sort, search, page = 1, limit = 12
        } = req.query;

        // Фильтр
        const filter = {};

        if (category) filter.category = category;
        if (minRating) filter.rating = { $gte: parseFloat(minRating) };
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        // Потекстовый поиск
        if (search) {
            filter.$text = { $search: search };
        }

        // Сортировка
        let sortOption = {};
        switch (sort) {
            case 'price_asc': sortOption = { price: 1 }; break;
            case 'price_desc': sortOption = { price: -1 }; break;
            case 'rating': sortOption = { rating: -1 }; break;
            case 'newest': sortOption = { createdAt: -1 }; break;
            default: sortOption = { createdAt: -1 };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Product.countDocuments(filter);

        const products = await Product
            .find(filter)
            .populate('category', 'name slug')
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            products,
            total,
            pages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Получить рекомендуемый товар
exports.getRecommended = async (req, res) => {
    try {
        const products = await Product
            .find({ isRecommended: true })
            .populate('category', 'name slug')
            .limit(8);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Получить товар
exports.getProductById = async (req, res) => {
    try {
        const product = await Product
            .findById(req.params.id)
            .populate('category', 'name slug');

        if (!product) {
            return res.status(404).json({ message: 'Товар не найден' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Создание товара (только админ)
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Обновление товара (только админ)
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Товар не найден' });
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Удаление товара (только админ)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Товар не найден' });
        }
        res.json({ message: 'Товар удалён' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
