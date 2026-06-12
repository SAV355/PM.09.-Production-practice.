import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    removeFromCart,
    updateQuantity,
    clearCart,
    selectCartItems,
    selectCartTotalPrice,
} from '../../store/slices/cartSlice';
import styles from './CartPage.module.scss';

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(selectCartItems);
    const totalPrice = useSelector(selectCartTotalPrice);

    const getImageUrl = (path) => {
        if (!path) return '/placeholder.jpg';
        if (path.startsWith('http')) return path;
        return `${process.env.REACT_APP_API_URL?.replace('/api', '')}/${path}`;
    };

    if (items.length === 0) {
        return (
            <div className={styles.empty}>
                <div className={styles.emptyIcon}>🛒</div>
                <h2 className={styles.emptyTitle}>Корзина пуста</h2>
                <p className={styles.emptyText}>
                    Добавьте товары из каталога
                </p>
                <Link to="/catalog" className={styles.catalogBtn}>
                    Перейти в каталог
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>Корзина</h1>

                <div className={styles.layout}>

                    {/* ===== СПИСОК ТОВАРОВ ===== */}
                    <div className={styles.itemsList}>

                        {/* Шапка таблицы */}
                        <div className={styles.tableHeader}>
                            <span>Товар</span>
                            <span>Цена</span>
                            <span>Количество</span>
                            <span>Сумма</span>
                            <span />
                        </div>

                        {items.map((item) => (
                            <div key={item._id} className={styles.cartItem}>

                                {/* Изображение + название */}
                                <div className={styles.itemInfo}>
                                    <img
                                        src={getImageUrl(item.images?.[0])}
                                        alt={item.name}
                                        className={styles.itemImage}
                                    />
                                    <div className={styles.itemMeta}>
                                        <Link
                                            to={`/product/${item._id}`}
                                            className={styles.itemName}
                                        >
                                            {item.name}
                                        </Link>
                                        <span className={styles.itemCategory}>
                                            {item.category?.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Цена за единицу */}
                                <div className={styles.itemPrice}>
                                    {item.price.toLocaleString('ru-RU')} ₽
                                </div>

                                {/* Количество */}
                                <div className={styles.itemQuantity}>
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() =>
                                            dispatch(updateQuantity({
                                                id: item._id,
                                                quantity: item.quantity - 1,
                                            }))
                                        }
                                        disabled={item.quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <span className={styles.qtyValue}>
                                        {item.quantity}
                                    </span>
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() =>
                                            dispatch(updateQuantity({
                                                id: item._id,
                                                quantity: item.quantity + 1,
                                            }))
                                        }
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Сумма по позиции */}
                                <div className={styles.itemTotal}>
                                    {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                                </div>

                                {/* Кнопка удаления */}
                                <button
                                    className={styles.removeBtn}
                                    onClick={() => dispatch(removeFromCart(item._id))}
                                    title="Удалить товар"
                                >
                                    ✕
                                </button>

                            </div>
                        ))}

                        {/* Кнопка очистки корзины */}
                        <div className={styles.cartActions}>
                            <button
                                className={styles.clearBtn}
                                onClick={() => dispatch(clearCart())}
                            >
                                🗑 Очистить корзину
                            </button>
                            <Link to="/catalog" className={styles.continueBtn}>
                                ← Продолжить покупки
                            </Link>
                        </div>
                    </div>

                    {/* ===== ИТОГО ===== */}
                    <div className={styles.summary}>
                        <h2 className={styles.summaryTitle}>Итого</h2>

                        <div className={styles.summaryRows}>
                            <div className={styles.summaryRow}>
                                <span>Товаров:</span>
                                <span>
                                    {items.reduce((sum, i) => sum + i.quantity, 0)} шт.
                                </span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Позиций:</span>
                                <span>{items.length}</span>
                            </div>
                            <div className={styles.summaryDivider} />
                            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                                <span>Сумма заказа:</span>
                                <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                            </div>
                        </div>

                        <button
                            className={styles.checkoutBtn}
                            onClick={() => navigate('/checkout')}
                        >
                            Оформить заказ →
                        </button>

                        <p className={styles.summaryNote}>
                            🔒 Безопасная оплата. Доставка по всей России.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CartPage;
