import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import styles from './ProductCard.module.scss';

const StarRating = ({ rating }) => {
    return (
        <div className={styles.stars}>
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
            <span className={styles.ratingValue}>({rating})</span>
        </div>
    );
};

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    const handleAddToCart = (e) => {
        e.preventDefault();
        dispatch(addToCart(product));
    };

    const imageUrl = product.images?.[0]
        ? `${process.env.REACT_APP_API_URL?.replace('/api', '')}/${product.images[0]}`
        : '/placeholder.jpg';

    return (
        <Link to={`/product/${product._id}`} className={styles.card}>

            <div className={styles.imageWrapper}>
                <img
                    src={imageUrl}
                    alt={product.name}
                    className={styles.image}
                />
                {product.isRecommended && (
                    <span className={styles.badge}>Рекомендуем</span>
                )}
            </div>

            <div className={styles.body}>
                <p className={styles.category}>
                    {product.category?.name}
                </p>
                <h3 className={styles.name}>{product.name}</h3>
                <StarRating rating={product.rating} />
                <p className={styles.reviews}>
                    {product.reviewCount} отзывов
                </p>
            </div>

            <div className={styles.footer}>
                <span className={styles.price}>
                    {product.price.toLocaleString('ru-RU')} ₽
                </span>
                <button
                    className={styles.addBtn}
                    onClick={handleAddToCart}
                >
                    В корзину
                </button>
            </div>

        </Link>
    );
};

export default ProductCard;
