import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearCurrent } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import api from '../../utils/api';
import styles from './ProductPage.module.scss';

// Компонент выбора звёзд
const StarPicker = ({ value, onChange }) => (
    <div className={styles.starPicker}>
        {[1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                type="button"
                className={`${styles.star} ${star <= value ? styles.starOn : ''}`}
                onClick={() => onChange(star)}
            >
                ★
            </button>
        ))}
    </div>
);

// Компонент отображения звёзд
const StarDisplay = ({ rating }) => (
    <div className={styles.starDisplay}>
        {[1, 2, 3, 4, 5].map((star) => (
            <span
                key={star}
                className={star <= Math.round(rating)
                    ? styles.starFilled
                    : styles.starEmpty}
            >
                ★
            </span>
        ))}
    </div>
);

const ProductPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { current: product, loading } =
        useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);

    const [activeImg, setActiveImg] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [addedToCart, setAddedToCart] = useState(false);

    // Форма отзыва
    const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' });
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState(false);

    // Загрузка товара
    useEffect(() => {
        dispatch(fetchProductById(id));
        return () => dispatch(clearCurrent());
    }, [dispatch, id]);

    // Загрузка отзывов
    useEffect(() => {
        if (id) {
            api.get(`/reviews/product/${id}`)
                .then(({ data }) => setReviews(data))
                .catch(console.error);
        }
    }, [id]);

    // Добавление в корзину с анимацией
    const handleAddToCart = () => {
        dispatch(addToCart(product));
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    // Отправка отзыва
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewForm.text.trim()) {
            setReviewError('Введите текст отзыва');
            return;
        }

        setReviewLoading(true);
        setReviewError('');

        try {
            const { data } = await api.post('/reviews', {
                productId: id,
                rating: reviewForm.rating,
                text: reviewForm.text,
            });

            setReviews((prev) => [data, ...prev]);
            setReviewForm({ rating: 5, text: '' });
            setReviewSuccess(true);
            setTimeout(() => setReviewSuccess(false), 3000);
        } catch (error) {
            setReviewError(
                error.response?.data?.message || 'Ошибка при отправке отзыва'
            );
        } finally {
            setReviewLoading(false);
        }
    };

    // Получение URL изображения
    const getImageUrl = (path) => {
        if (!path) return '/placeholder.jpg';
        if (path.startsWith('http')) return path;
        return `${process.env.REACT_APP_API_URL?.replace('/api', '')}/${path}`;
    };

    if (loading) {
        return (
            <div className={styles.loaderWrapper}>
                <div className={styles.spinner} />
                <p>Загрузка товара...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className={styles.notFound}>
                <h2>😔 Товар не найден</h2>
                <p>Возможно, он был удалён или перемещён</p>
            </div>
        );
    }

    const images = product.images?.length > 0
        ? product.images
        : [null];

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                {/* ===== ВЕРХНЯЯ ЧАСТЬ: ФОТО + ИНФО ===== */}
                <div className={styles.productTop}>

                    {/* Галерея изображений */}
                    <div className={styles.gallery}>
                        <div className={styles.mainImageWrapper}>
                            <img
                                src={getImageUrl(images[activeImg])}
                                alt={product.name}
                                className={styles.mainImage}
                            />
                        </div>

                        {images.length > 1 && (
                            <div className={styles.thumbnails}>
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        className={`${styles.thumb} ${idx === activeImg ? styles.thumbActive : ''
                                            }`}
                                        onClick={() => setActiveImg(idx)}
                                    >
                                        <img
                                            src={getImageUrl(img)}
                                            alt={`${product.name} ${idx + 1}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Информация о товаре */}
                    <div className={styles.info}>

                        {/* Категория и название */}
                        <p className={styles.categoryLabel}>
                            {product.category?.name}
                        </p>
                        <h1 className={styles.productName}>{product.name}</h1>

                        {/* Рейтинг */}
                        <div className={styles.ratingRow}>
                            <StarDisplay rating={product.rating} />
                            <span className={styles.ratingText}>
                                {product.rating} из 5
                            </span>
                            <span className={styles.reviewCount}>
                                ({product.reviewCount} отзывов)
                            </span>
                        </div>

                        {/* Цена */}
                        <div className={styles.priceBlock}>
                            <span className={styles.price}>
                                {product.price.toLocaleString('ru-RU')} ₽
                            </span>
                            <span className={`${styles.stock} ${product.stock > 0 ? styles.inStock : styles.outStock
                                }`}>
                                {product.stock > 0
                                    ? `✓ В наличии (${product.stock} шт.)`
                                    : '✗ Нет в наличии'}
                            </span>
                        </div>

                        {/* Описание */}
                        <div className={styles.description}>
                            <h3 className={styles.descTitle}>Описание</h3>
                            <p className={styles.descText}>{product.description}</p>
                        </div>

                        {/* Кнопка добавления в корзину */}
                        <button
                            className={`${styles.addToCartBtn} ${addedToCart ? styles.addedToCart : ''
                                }`}
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                        >
                            {addedToCart ? '✓ Добавлено в корзину!' : '🛒 Добавить в корзину'}
                        </button>

                    </div>
                </div>

                {/* ===== ХАРАКТЕРИСТИКИ ===== */}
                {product.characteristics?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Характеристики</h2>
                        <div className={styles.characteristics}>
                            {product.characteristics.map((char, idx) => (
                                <div key={idx} className={styles.charRow}>
                                    <span className={styles.charKey}>{char.key}</span>
                                    <span className={styles.charDots} />
                                    <span className={styles.charValue}>{char.value}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ===== ОТЗЫВЫ ===== */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        Отзывы
                        <span className={styles.reviewsBadge}>
                            {reviews.length}
                        </span>
                    </h2>

                    {/* Форма добавления отзыва */}
                    {user ? (
                        <form
                            onSubmit={handleReviewSubmit}
                            className={styles.reviewForm}
                        >
                            <h3 className={styles.reviewFormTitle}>
                                Оставить отзыв
                            </h3>

                            <div className={styles.ratingSelect}>
                                <label className={styles.reviewLabel}>Оценка</label>
                                <StarPicker
                                    value={reviewForm.rating}
                                    onChange={(val) =>
                                        setReviewForm((prev) => ({ ...prev, rating: val }))
                                    }
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.reviewLabel}>
                                    Ваш отзыв
                                </label>
                                <textarea
                                    className={styles.textarea}
                                    rows={4}
                                    placeholder="Расскажите о товаре..."
                                    value={reviewForm.text}
                                    onChange={(e) =>
                                        setReviewForm((prev) => ({
                                            ...prev,
                                            text: e.target.value,
                                        }))
                                    }
                                />
                            </div>

                            {reviewError && (
                                <p className={styles.errorMsg}>{reviewError}</p>
                            )}
                            {reviewSuccess && (
                                <p className={styles.successMsg}>
                                    ✓ Отзыв успешно добавлен!
                                </p>
                            )}

                            <button
                                type="submit"
                                className={styles.submitReviewBtn}
                                disabled={reviewLoading}
                            >
                                {reviewLoading ? 'Отправка...' : 'Отправить отзыв'}
                            </button>
                        </form>
                    ) : (
                        <div className={styles.loginPrompt}>
                            <p>
                                Чтобы оставить отзыв,{' '}
                                <a href="/login">войдите в аккаунт</a>
                            </p>
                        </div>
                    )}

                    {/* Список отзывов */}
                    <div className={styles.reviewsList}>
                        {reviews.length === 0 ? (
                            <p className={styles.noReviews}>
                                Отзывов пока нет. Будьте первым!
                            </p>
                        ) : (
                            reviews.map((review) => (
                                <div key={review._id} className={styles.reviewCard}>
                                    <div className={styles.reviewHeader}>
                                        <div className={styles.reviewMeta}>
                                            <span className={styles.reviewAuthor}>
                                                👤 {review.user?.name || 'Пользователь'}
                                            </span>
                                            <StarDisplay rating={review.rating} />
                                        </div>
                                        <span className={styles.reviewDate}>
                                            {new Date(review.createdAt).toLocaleDateString(
                                                'ru-RU',
                                                {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                }
                                            )}
                                        </span>
                                    </div>
                                    <p className={styles.reviewText}>{review.text}</p>
                                </div>
                            ))
                        )}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default ProductPage;
