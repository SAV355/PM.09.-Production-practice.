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




