import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecommended } from '../../store/slices/productSlice';
import ProductCard from '../../components/ProductCard/ProductCard';
import api from '../../utils/api';
import styles from './HomePage.module.scss';

const HomePage = () => {
    const dispatch = useDispatch();
    const { recommended, loading } = useSelector((state) => state.products);
    const [categories, setCategories] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);

    useEffect(() => {
        // Загружаем рекомендуемые товары
        dispatch(fetchRecommended());

        // Загружаем категории
        api.get('/categories').then(({ data }) => setCategories(data));

        // Загружаем 3 последние статьи блога
        api.get('/blog?limit=3').then(({ data }) => setBlogPosts(data));
    }, [dispatch]);

    return (
        <main className={styles.page}>

            {/* ===== БАННЕР ===== */}
            <section className={styles.banner}>
                <div className={styles.bannerContent}>
                    <h1 className={styles.bannerTitle}>
                        Всё для пикника и&nbsp;туризма
                    </h1>
                    <p className={styles.bannerSubtitle}>
                        Снаряжение, посуда, палатки и&nbsp;многое другое —
                        для&nbsp;ваших лучших приключений на&nbsp;природе
                    </p>
                    <Link to="/catalog" className={styles.bannerBtn}>
                        Перейти в каталог
                    </Link>
                </div>
                <div className={styles.bannerOverlay} />
            </section>

            {/* ===== КАТЕГОРИИ ===== */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Категории товаров</h2>
                    <div className={styles.categoriesGrid}>
                        {categories.map((cat) => (
                            <Link
                                key={cat._id}
                                to={`/catalog?category=${cat._id}`}
                                className={styles.categoryCard}
                            >
                                {cat.image && (
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className={styles.categoryImage}
                                    />
                                )}
                                <span className={styles.categoryName}>{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== РЕКОМЕНДУЕМЫЕ ТОВАРЫ ===== */}
            <section className={`${styles.section} ${styles.sectionGray}`}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Рекомендуемые товары</h2>
                        <Link to="/catalog" className={styles.seeAllLink}>
                            Смотреть все →
                        </Link>
                    </div>

                    {loading ? (
                        <div className={styles.loader}>Загрузка...</div>
                    ) : (
                        <div className={styles.productsGrid}>
                            {recommended.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ===== БЛОГ ===== */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Последние статьи</h2>
                        <Link to="/blog" className={styles.seeAllLink}>
                            Все статьи →
                        </Link>
                    </div>
                    <div className={styles.blogGrid}>
                        {blogPosts.map((post) => (
                            <Link
                                key={post._id}
                                to={`/blog/${post._id}`}
                                className={styles.blogCard}
                            >
                                {post.image && (
                                    <div className={styles.blogImageWrapper}>
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className={styles.blogImage}
                                        />
                                    </div>
                                )}
                                <div className={styles.blogBody}>
                                    <span className={styles.blogDate}>
                                        {new Date(post.createdAt).toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </span>
                                    <h3 className={styles.blogTitle}>{post.title}</h3>
                                    <p className={styles.blogAuthor}>
                                        Автор: {post.author}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
};

export default HomePage;
