import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import styles from './BlogPostPage.module.scss';

const BlogPostPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/blog/${id}`)
            .then(({ data }) => setPost(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className={styles.loaderWrapper}>
                <div className={styles.spinner} />
            </div>
        );
    }

    if (!post) {
        return (
            <div className={styles.notFound}>
                <h2>Статья не найдена</h2>
                <Link to="/blog">← Вернуться в блог</Link>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                {/* Хлебные крошки */}
                <div className={styles.breadcrumbs}>
                    <Link to="/" className={styles.crumb}>Главная</Link>
                    <span className={styles.crumbSep}>›</span>
                    <Link to="/blog" className={styles.crumb}>Блог</Link>
                    <span className={styles.crumbSep}>›</span>
                    <span className={styles.crumbCurrent}>{post.title}</span>
                </div>

                <article className={styles.article}>

                    {/* Изображение */}
                    {post.image && (
                        <div className={styles.imageWrapper}>
                            <img
                                src={post.image}
                                alt={post.title}
                                className={styles.image}
                            />
                        </div>
                    )}

                    {/* Мета-информация */}
                    <div className={styles.meta}>
                        <span className={styles.author}>✍️ {post.author}</span>
                        <span className={styles.metaSep}>•</span>
                        <span className={styles.date}>
                            {new Date(post.createdAt).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </span>
                    </div>

                    {/* Заголовок */}
                    <h1 className={styles.title}>{post.title}</h1>

                    {/* Контент */}
                    <div className={styles.content}>
                        {post.content.split('\n').map((paragraph, idx) =>
                            paragraph.trim() ? (
                                <p key={idx}>{paragraph}</p>
                            ) : (
                                <br key={idx} />
                            )
                        )}
                    </div>

                </article>

                {/* Ссылка назад */}
                <Link to="/blog" className={styles.backLink}>
                    ← Все статьи
                </Link>

            </div>
        </div>
    );
};

export default BlogPostPage;
