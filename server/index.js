const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/picnic-shop')
    .then(() => console.log('✅ MongoDB подключена'))
    .catch(err => console.error('❌ Ошибка подключения:', err));

// Роуты
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/blog', require('./routes/blogRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
