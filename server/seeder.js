const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
const Blog = require('./models/Blog');

// ── Данные категорий ──────────────────────────────────────────
const categoriesData = [
    {
        name: 'Палатки и тенты',
        slug: 'tents',
        description: 'Палатки, навесы и тенты для кемпинга',
        image: 'https://placehold.co/200x200/2c7a4b/white?text=Палатки',
    },
    {
        name: 'Спальные мешки',
        slug: 'sleeping-bags',
        description: 'Спальники для любой погоды',
        image: 'https://placehold.co/200x200/2c7a4b/white?text=Спальники',
    },
    {
        name: 'Посуда и горелки',
        slug: 'cookware',
        description: 'Котелки, кружки, горелки и аксессуары',
        image: 'https://placehold.co/200x200/2c7a4b/white?text=Посуда',
    },
    {
        name: 'Рюкзаки',
        slug: 'backpacks',
        description: 'Туристические и городские рюкзаки',
        image: 'https://placehold.co/200x200/2c7a4b/white?text=Рюкзаки',
    },
    {
        name: 'Мебель для кемпинга',
        slug: 'furniture',
        description: 'Складные столы, стулья и кровати',
        image: 'https://placehold.co/200x200/2c7a4b/white?text=Мебель',
    },
    {
        name: 'Освещение',
        slug: 'lighting',
        description: 'Фонари, лампы и фары',
        image: 'https://placehold.co/200x200/2c7a4b/white?text=Свет',
    },
    {
        name: 'Одежда и обувь',
        slug: 'clothing',
        description: 'Куртки, штаны, ботинки для туризма',
        image: 'https://placehold.co/200x200/2c7a4b/white?text=Одежда',
    },
    {
        name: 'Инструменты и безопасность',
        slug: 'tools',
        description: 'Ножи, топоры, аптечки и навигация',
        image: 'https://placehold.co/200x200/2c7a4b/white?text=Инструменты',
    },
];

// ── Генератор товаров ─────────────────────────────────────────
const createProductsData = (categories) => {
    const cat = (slug) =>
        categories.find((c) => c.slug === slug)?._id;

    return [
        // Палатки
        {
            name: 'Палатка туристическая 3-местная Alpine Pro',
            description: 'Надёжная трёхместная палатка для походов. Водонепроницаемый тент, усиленные колышки, быстрая установка.',
            price: 8990,
            category: cat('tents'),
            stock: 15,
            rating: 4.7,
            reviewCount: 23,
            isRecommended: true,
            images: ['https://placehold.co/600x600/e8f5e9/2c7a4b?text=Палатка+3м'],
            characteristics: [
                { key: 'Вместимость', value: '3 человека' },
                { key: 'Вес', value: '2.8 кг' },
                { key: 'Водостойкость', value: '3000 мм' },
                { key: 'Сезонность', value: '3 сезона' },
                { key: 'Размер (Д×Ш×В)', value: '210×180×120 см' },
            ],
        },
        {
            name: 'Палатка двухместная UltraLight',
            description: 'Ультралёгкая двухместная палатка для треккинга. Минимальный вес при максимальной прочности.',
            price: 12490,
            category: cat('tents'),
            stock: 8,
            rating: 4.9,
            reviewCount: 41,
            isRecommended: true,
            images: ['https://placehold.co/600x600/e8f5e9/2c7a4b?text=Палатка+2м'],
            characteristics: [
                { key: 'Вместимость', value: '2 человека' },
                { key: 'Вес', value: '1.4 кг' },
                { key: 'Водостойкость', value: '5000 мм' },
                { key: 'Сезонность', value: '4 сезона' },
            ],
        },

        // Спальники
        {
            name: 'Спальный мешок зимний -20°C ComfortSleep',
            description: 'Тёплый спальник для зимних походов. Синтетический утеплитель, двусторонняя молния, компрессионный мешок.',
            price: 4590,
            category: cat('sleeping-bags'),
            stock: 22,
            rating: 4.5,
            reviewCount: 17,
            isRecommended: true,
            images: ['https://placehold.co/600x600/dbeafe/1e40af?text=Спальник'],
            characteristics: [
                { key: 'Температура комфорта', value: '-10°C' },
                { key: 'Экстремальная т-ра', value: '-20°C' },
                { key: 'Вес', value: '1.9 кг' },
                { key: 'Наполнитель', value: 'Синтетика' },
                { key: 'Длина', value: '220 см' },
            ],
        },
        {
            name: 'Спальный мешок летний +5°C LightDream',
            description: 'Лёгкий летний спальник для кемпинга и фестивалей. Удобная форма кокон, яркий дизайн.',
            price: 2290,
            category: cat('sleeping-bags'),
            stock: 30,
            rating: 4.3,
            reviewCount: 29,
            isRecommended: false,
            images: ['https://placehold.co/600x600/dbeafe/1e40af?text=Спальник+лето'],
            characteristics: [
                { key: 'Температура комфорта', value: '+5°C' },
                { key: 'Вес', value: '0.95 кг' },
                { key: 'Наполнитель', value: 'Полиэстер' },
            ],
        },

        // Посуда и горелки
        {
            name: 'Газовая горелка компактная BurnMaster Pro',
            description: 'Мощная компактная горелка с пьезоподжигом. Совместима со стандартными резьбовыми баллонами.',
            price: 1890,
            category: cat('cookware'),
            stock: 45,
            rating: 4.8,
            reviewCount: 56,
            isRecommended: true,
            images: ['https://placehold.co/600x600/fef3c7/92400e?text=Горелка'],
            characteristics: [
                { key: 'Мощность', value: '3200 Вт' },
                { key: 'Вес', value: '88 г' },
                { key: 'Пьезоподжиг', value: 'Есть' },
                { key: 'Тип баллона', value: 'Резьбовой' },
                { key: 'Регулировка пламени', value: 'Плавная' },
            ],
        },
        {
            name: 'Набор походной посуды 4 предмета CampSet',
            description: 'Алюминиевый набор: котелок, сковорода, крышка-дуршлаг и ручка. Антипригарное покрытие.',
            price: 2750,
            category: cat('cookware'),
            stock: 18,
            rating: 4.4,
            reviewCount: 33,
            isRecommended: false,
            images: ['https://placehold.co/600x600/fef3c7/92400e?text=Посуда'],
            characteristics: [
                { key: 'Материал', value: 'Анодированный алюминий' },
                { key: 'Предметов', value: '4 шт.' },
                { key: 'Объём', value: '1.5 л + 0.8 л' },
                { key: 'Вес набора', value: '320 г' },
            ],
        },

        // Рюкзаки
        {
            name: 'Рюкзак туристический 60L TrekPack',
            description: 'Вместительный туристический рюкзак с системой вентиляции спины и поясным ремнём.',
            price: 6490,
            category: cat('backpacks'),
            stock: 12,
            rating: 4.6,
            reviewCount: 44,
            isRecommended: true,
            images: ['https://placehold.co/600x600/f5f3ff/5b21b6?text=Рюкзак+60L'],
            characteristics: [
                { key: 'Объём', value: '60 л' },
                { key: 'Вес', value: '1.8 кг' },
                { key: 'Материал', value: 'Нейлон 420D' },
                { key: 'Поясной ремень', value: 'Анатомический' },
                { key: 'Вентиляция спины', value: 'AirMesh' },
                { key: 'Дождевой чехол', value: 'В комплекте' },
            ],
        },
        {
            name: 'Рюкзак городской 30L DayPack',
            description: 'Универсальный рюкзак для однодневных походов и города. Отделение для ноутбука.',
            price: 3290,
            category: cat('backpacks'),
            stock: 25,
            rating: 4.2,
            reviewCount: 18,
            isRecommended: false,
            images: ['https://placehold.co/600x600/f5f3ff/5b21b6?text=Рюкзак+30L'],
            characteristics: [
                { key: 'Объём', value: '30 л' },
                { key: 'Вес', value: '0.7 кг' },
                { key: 'Ноутбук', value: 'До 15.6"' },
                { key: 'USB-порт', value: 'Есть' },
            ],
        },

        // Мебель
        {
            name: 'Складной стол алюминиевый CampTable',
            description: 'Лёгкий складной стол для кемпинга. Регулируемые ножки, компактный чехол.',
            price: 3190,
            category: cat('furniture'),
            stock: 10,
            rating: 4.3,
            reviewCount: 12,
            isRecommended: false,
            images: ['https://placehold.co/600x600/fce7f3/831843?text=Стол'],
            characteristics: [
                { key: 'Размер (Д×Ш)', value: '120×60 см' },
                { key: 'Высота', value: '55–75 см (регул.)' },
                { key: 'Материал', value: 'Алюминий + MDF' },
                { key: 'Нагрузка', value: 'До 50 кг' },
                { key: 'Вес', value: '4.2 кг' },
            ],
        },
        {
            name: 'Складное кресло с подстаканником RelaxChair',
            description: 'Удобное складное кресло с поясничной поддержкой и боковым карманом.',
            price: 1890,
            category: cat('furniture'),
            stock: 20,
            rating: 4.5,
            reviewCount: 27,
            isRecommended: true,
            images: ['https://placehold.co/600x600/fce7f3/831843?text=Кресло'],
            characteristics: [
                { key: 'Нагрузка', value: 'До 120 кг' },
                { key: 'Вес', value: '1.6 кг' },
                { key: 'Материал', value: 'Сталь + Oxford 600D' },
                { key: 'Подстакан', value: 'Есть' },
            ],
        },

        // Освещение
        {
            name: 'Налобный фонарь 500 лм HeadLight Pro',
            description: 'Мощный налобный фонарь с тремя режимами яркости и красным ночным режимом.',
            price: 1290,
            category: cat('lighting'),
            stock: 40,
            rating: 4.7,
            reviewCount: 62,
            isRecommended: true,
            images: ['https://placehold.co/600x600/ecfdf5/064e3b?text=Фонарь'],
            characteristics: [
                { key: 'Яркость', value: '500 лм' },
                { key: 'Дальность', value: 'До 100 м' },
                { key: 'Время работы', value: 'До 12 ч' },
                { key: 'Питание', value: '3×AAA' },
                { key: 'Водозащита', value: 'IPX4' },
                { key: 'Режимы', value: 'Яркий/Средний/Красный' },
            ],
        },
        {
            name: 'Кемпинговый фонарь-лампа SolarLantern',
            description: 'Подвесной фонарь с солнечной панелью и USB-зарядкой. Складывается для компактного хранения.',
            price: 2490,
            category: cat('lighting'),
            stock: 16,
            rating: 4.4,
            reviewCount: 19,
            isRecommended: false,
            images: ['https://placehold.co/600x600/ecfdf5/064e3b?text=Лампа'],
            characteristics: [
                { key: 'Яркость', value: '300 лм' },
                { key: 'Зарядка', value: 'Solar + USB' },
                { key: 'Ёмкость АКБ', value: '4000 мАч' },
                { key: 'Водозащита', value: 'IPX5' },
            ],
        },

        // Одежда
        {
            name: 'Куртка трекинговая ветрозащитная WindShell',
            description: 'Лёгкая ветрозащитная куртка с капюшоном. Упаковывается в карман.',
            price: 4990,
            category: cat('clothing'),
            stock: 14,
            rating: 4.6,
            reviewCount: 31,
            isRecommended: true,
            images: ['https://placehold.co/600x600/fff7ed/7c2d12?text=Куртка'],
            characteristics: [
                { key: 'Материал', value: 'Polyester Ripstop' },
                { key: 'Вес', value: '280 г' },
                { key: 'Ветрозащита', value: 'Да' },
                { key: 'Водоотталкивание', value: 'DWR-пропитка' },
                { key: 'Капюшон', value: 'Убирается в воротник' },
            ],
        },
        {
            name: 'Трекинговые ботинки GripTrek Mid',
            description: 'Высокие трекинговые ботинки с мембраной и подошвой Vibram. Защита голеностопа.',
            price: 9490,
            category: cat('clothing'),
            stock: 9,
            rating: 4.8,
            reviewCount: 47,
            isRecommended: true,
            images: ['https://placehold.co/600x600/fff7ed/7c2d12?text=Ботинки'],
            characteristics: [
                { key: 'Мембрана', value: 'Gore-Tex' },
                { key: 'Подошва', value: 'Vibram' },
                { key: 'Высота', value: 'Mid (высокие)' },
                { key: 'Материал', value: 'Нубук + сетка' },
            ],
        },

        // Инструменты
        {
            name: 'Мультитул складной 14-в-1 SurviveMaster',
            description: 'Компактный мультитул из нержавеющей стали. 14 функций в одном инструменте.',
            price: 2190,
            category: cat('tools'),
            stock: 35,
            rating: 4.5,
            reviewCount: 53,
            isRecommended: false,
            images: ['https://placehold.co/600x600/f0fdf4/14532d?text=Мультитул'],
            characteristics: [
                { key: 'Функций', value: '14' },
                { key: 'Материал', value: 'Нержавеющая сталь' },
                { key: 'Вес', value: '180 г' },
                { key: 'Чехол', value: 'В комплекте' },
            ],
        },
        {
            name: 'Аптечка туристическая FirstAidKit',
            description: 'Компактная аптечка первой помощи. 42 предмета, водонепроницаемый чехол.',
            price: 890,
            category: cat('tools'),
            stock: 50,
            rating: 4.9,
            reviewCount: 88,
            isRecommended: false,
            images: ['https://placehold.co/600x600/f0fdf4/14532d?text=Аптечка'],
            characteristics: [
                { key: 'Предметов', value: '42 шт.' },
                { key: 'Водозащита', value: 'IPX4' },
                { key: 'Вес', value: '210 г' },
                { key: 'Инструкция', value: 'На русском языке' },
            ],
        },
    ];
};

// ── Данные блога ──────────────────────────────────────────────
const blogData = [
    {
        title: 'Как выбрать палатку для первого похода',
        content: 'Выбор палатки — один из важнейших шагов при подготовке к первому походу. Рассказываем о ключевых характеристиках: вместимость, сезонность, водостойкость и вес...',
        image: 'https://placehold.co/800x400/e8f5e9/2c7a4b?text=Блог:+Палатки',
        author: 'Алексей Горный',
    },
    {
        title: 'Топ-10 блюд для готовки на костре',
        content: 'Еда на природе кажется особенно вкусной! Мы собрали 10 простых и сытных рецептов, которые можно приготовить на открытом огне или газовой горелке...',
        image: 'https://placehold.co/800x400/fef3c7/92400e?text=Блог:+Рецепты',
        author: 'Мария Лесная',
    },
    {
        title: 'Маршруты для новичков: Подмосковье',
        content: 'Не нужно ехать далеко, чтобы насладиться природой. Подборка лучших пешеходных маршрутов Подмосковья для начинающих туристов с подробными описаниями...',
        image: 'https://placehold.co/800x400/dbeafe/1e40af?text=Блог:+Маршруты',
        author: 'Дмитрий Поход',
    },
    {
        title: 'Как правильно укладывать рюкзак',
        content: 'Правильная укладка рюкзака — залог комфортного похода. Тяжёлые вещи ближе к спине, лёгкие — наверх. Разбираем принципы баланса и распределения веса...',
        image: 'https://placehold.co/800x400/f5f3ff/5b21b6?text=Блог:+Рюкзак',
        author: 'Алексей Горный',
    },
    {
        title: 'Безопасность в походе: 10 правил',
        content: 'Безопасность — прежде всего. Рассказываем о базовых правилах поведения на природе: как не заблудиться, что делать при встрече с дикими животными...',
        image: 'https://placehold.co/800x400/fce7f3/831843?text=Блог:+Безопасность',
        author: 'Мария Лесная',
    },
];

// ── Главная функция сидера ────────────────────────────────────
const seedDatabase = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI || 'mongodb://localhost:27017/picnic-shop'
        );
        console.log('✅ MongoDB подключена');

        // Очистка коллекций
        await Promise.all([
            Category.deleteMany({}),
            Product.deleteMany({}),
            User.deleteMany({}),
            Blog.deleteMany({}),
        ]);
        console.log('🗑  Старые данные удалены');

        // Создание категорий
        const categories = await Category.insertMany(categoriesData);
        console.log(`📁 Создано категорий: ${categories.length}`);

        // Создание товаров
        const productsData = createProductsData(categories);
        const products = await Product.insertMany(productsData);
        console.log(`📦 Создано товаров: ${products.length}`);

        // Создание пользователей
        const hashedAdminPass = await bcrypt.hash('admin123', 10);
        const hashedUserPass = await bcrypt.hash('user123', 10);

        const users = await User.insertMany([
            {
                name: 'Администратор',
                email: 'admin@picnicshop.ru',
                password: hashedAdminPass,
                role: 'admin',
                phone: '+7 (999) 000-00-00',
                address: 'г. Москва, ул. Ленина, д. 1',
            },
            {
                name: 'Иван Иванов',
                email: 'user@picnicshop.ru',
                password: hashedUserPass,
                role: 'user',
                phone: '+7 (999) 123-45-67',
                address: 'г. Санкт-Петербург, ул. Невская, д. 10',
            },
            {
                name: 'Мария Петрова',
                email: 'maria@picnicshop.ru',
                password: hashedUserPass,
                role: 'user',
                phone: '+7 (999) 987-65-43',
                address: 'г. Екатеринбург, ул. Мира, д. 5',
            },
        ]);
        console.log(`👤 Создано пользователей: ${users.length}`);

        // Создание статей блога
        const blog = await Blog.insertMany(blogData);
        console.log(`📝 Создано статей блога: ${blog.length}`);

        // Итоговый вывод
        console.log('\n═══════════════════════════════════════');
        console.log('✅ База данных успешно заполнена!');
        console.log('═══════════════════════════════════════');
        console.log('🔑 Данные для входа:');
        console.log('   Админ:       admin@picnicshop.ru / admin123');
        console.log('   Пользователь: user@picnicshop.ru  / user123');
        console.log('═══════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Ошибка при заполнении БД:', error);
        process.exit(1);
    }
};

seedDatabase();

