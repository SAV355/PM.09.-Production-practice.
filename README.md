# 🏕️ ПикникШоп — Интернет-магазин товаров для пикника и туризма

## Технологический стек

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT аутентификация
- bcryptjs

### Frontend
- React.js 18
- Redux Toolkit
- React Router v6
- SCSS Modules
- Axios

---

## Структура проекта
```
picnic-shop/

│

├── server/                        # Backend

│   ├── index.js                   # Точка входа

│   ├── seeder.js                  # Заполнение БД

│   ├── package.json

│   ├── .env

│   │

│   ├── models/                    # Mongoose модели

│   │   ├── User.js

│   │   ├── Product.js

│   │   ├── Category.js

│   │   ├── Order.js

│   │   ├── Review.js

│   │   └── Blog.js

│   │

│   ├── routes/                    # Маршруты API

│   │   ├── userRoutes.js

│   │   ├── productRoutes.js

│   │   ├── categoryRoutes.js

│   │   ├── orderRoutes.js

│   │   ├── reviewRoutes.js

│   │   ├── blogRoutes.js

│   │   └── adminRoutes.js

│   │

│   ├── middleware/                # Middleware

│   │   └── authMiddleware.js

│   │

│   └── uploads/                  # Загруженные файлы

│

└── client/                       # Frontend

├── public/

│   └── index.html

├── src/

│   ├── index.js               # Точка входа

│   ├── index.scss             # Глобальные стили

│   ├── App.jsx                # Маршрутизация

│   │

│   ├── store/                 # Redux

│   │   ├── index.js

│   │   └── slices/

│   │       ├── authSlice.js

│   │       ├── cartSlice.js

│   │       ├── productSlice.js

│   │       └── orderSlice.js

│   │

│   ├── utils/

│   │   └── api.js             # Axios instance

│   │

│   ├── components/            # Переиспользуемые компоненты

│   │   ├── Header/

│   │   │   ├── Header.jsx

│   │   │   └── Header.module.scss

│   │   ├── Footer/

│   │   │   ├── Footer.jsx

│   │   │   └── Footer.module.scss

│   │   └── ProductCard/

│   │       ├── ProductCard.jsx

│   │       └── ProductCard.module.scss

│   │

│   └── pages/                 # Страницы

│       ├── HomePage/

│       │   ├── HomePage.jsx

│       │   └── HomePage.module.scss

│       ├── CatalogPage/

│       │   ├── CatalogPage.jsx

│       │   └── CatalogPage.module.scss

│       ├── ProductPage/

│       │   ├── ProductPage.jsx

│       │   └── ProductPage.module.scss

│       ├── CartPage/

│       │   ├── CartPage.jsx

│       │   └── CartPage.module.scss

│       ├── CheckoutPage/

│       │   ├── CheckoutPage.jsx

│       │   └── CheckoutPage.module.scss

│       ├── OrderSuccessPage/

│       │   ├── OrderSuccessPage.jsx

│       │   └── OrderSuccessPage.module.scss

│       ├── LoginPage/

│       │   ├── LoginPage.jsx

│       │   └── AuthPage.module.scss

│       ├── RegisterPage/

│       │   └── RegisterPage.jsx

│       ├── ProfilePage/

│       │   ├── ProfilePage.jsx

│       │   ├── ProfilePage.module.scss

│       │   └── tabs/

│       │       ├── ProfileInfo.jsx

│       │       ├── ProfileOrders.jsx

│       │       └── ProfileTabs.module.scss

│       ├── AdminPage/

│       │   ├── AdminPage.jsx

│       │   ├── AdminPage.module.scss

│       │   └── tabs/

│       │       ├── AdminStats.jsx

│       │       ├── AdminOrders.jsx

│       │       ├── AdminProducts.jsx

│       │       └── AdminTabs.module.scss

│       ├── BlogPage/

│       │   ├── BlogPage.jsx

│       │   └── BlogPage.module.scss

│       ├── BlogPostPage/

│       │   ├── BlogPostPage.jsx

│       │   └── BlogPostPage.module.scss

│       └── NotFoundPage/

│           ├── NotFoundPage.jsx

│           └── NotFoundPage.module.scss

│

├── package.json

└── .env
```


---

## Установка и запуск

### 1. Клонирование репозитория
```bash
git clone https://github.com/yourname/picnic-shop.git
cd picnic-shop
```

### 2. Установка зависимостей

# Backend
cd server
npm install

# Frontend
cd ../client
npm install

### 3. Настройка переменных окружения

server/.env
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/picnic-shop
JWT_SECRET=picnic_shop_secret_key_2024
NODE_ENV=development
```

client/.env
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Заполнение базы данных
```
cd server
npm run seed
```

### 5. Запуск серверов
```
# Backend (порт 5000)
cd server
npm run dev

# Frontend (порт 3000)
cd client
npm start
```




