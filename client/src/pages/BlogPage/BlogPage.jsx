import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import styles from './BlogPage.module.scss';

const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/blog')
            .then(({ data }) => setPosts(data))
            .catch(() => setError('Не удалось загрузить статьи'))
            .finally(() => setLoading(false));
    }, []);

    // ── Загрузка ──────────────────────────────────────────────
    if (loading) {
        return (
            <div className={styles.loaderWrapper}>
                <div className={styles.spinner} />
                <p>Загрузка статей...</p>
            </div>
        );
    }

    // ── Ошибка ────────────────────────────────────────────────
    if (error) {
        return (
            <div className={styles.errorWrapper}>
                <p className={styles.errorText}>😔 {error}</p>
                <button
                    className={styles.retryBtn}
                    onClick={() => window.location.reload()}
                >
                    Попробовать снова
                </button>
            </div>
        );
    }

    // ── Основной рендер ───────────────────────────────────────
    return (
        <div className={styles.page}>
            <div className={styles.container}>

                {/* Шапка страницы */}
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>📰 Блог о туризме</h1>
                    <p className={styles.pageSubtitle}>
                        Советы, маршруты и обзоры снаряжения для активного отдыха
                    </p>
                </div>

                {/* Пустое состояние */}
                {posts.length === 0 ? (
                    <div className={styles.empty}>
                        <span className={styles.emptyIcon}>📭</span>
                        <p className={styles.emptyTitle}>Статей пока нет</p>
                        <p className={styles.emptyText}>
                            Загляните позже — скоро здесь появятся интересные материалы
                        </p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {posts.map((post) => (
                            <article key={post._id} className={styles.card}>
                                <Link
                                    to={`/blog/${post._id}`}
                                    className={styles.cardLink}
                                >
                                    {/* Изображение */}
                                    <div className={styles.imageWrapper}>
                                        {post.image ? (
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className={styles.image}
                                            />
                                        ) : (
                                            <div className={styles.imagePlaceholder}>
                                                📰
                                            </div>
                                        )}
                                    </div>

                                    {/* Тело карточки */}
                                    <div className={styles.body}>

                                        {/* Дата */}
                                        <time className={styles.date}>
                                            {new Date(post.createdAt).toLocaleDateString(
                                                'ru-RU',
                                                {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                }
                                            )}
                                        </time>

                                        {/* Заголовок */}
                                        <h2 className={styles.title}>{post.title}</h2>

                                        {/* Краткое содержание */}
                                        <p className={styles.excerpt}>
                                            {post.content.length > 130
                                                ? `${post.content.substring(0, 130)}...`
                                                : post.content}
                                        </p>

                                        {/* Подвал карточки */}
                                        <div className={styles.cardFooter}>
                                            <span className={styles.author}>
                                                ✍️ {post.author}
                                            </span>
                                            <span className={styles.readMore}>
                                                Читать далее →
                                            </span>
                                        </div>

                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default BlogPage;
