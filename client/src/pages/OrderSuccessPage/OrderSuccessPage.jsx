import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetOrderSuccess } from '../../store/slices/orderSlice';
import api from '../../utils/api';
import styles from './OrderSuccessPage.module.scss';

const STATUS_LABELS = {
    pending: { label: 'Ожидает обработки', color: '#f59e0b' },
    processing: { label: 'В обработке', color: '#3b82f6' },
    shipped: { label: 'Отправлен', color: '#8b5cf6' },
    delivered: { label: 'Доставлен', color: '#2c7a4b' },
    cancelled: { label: 'Отменён', color: '#e74c3c' },
};

const DELIVERY_LABELS = {
    courier: '🚚 Курьерская доставка',
    pickup: '🏪 Самовывоз',
    post: '📦 Почта России',
};

const PAYMENT_LABELS = {
    cash: '💵 Наличными при получении',
    card: '💳 Онлайн-оплата картой',
};

const OrderSuccessPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(resetOrderSuccess());

        api.get(`/orders/${id}`)
            .then(({ data }) => setOrder(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id, dispatch]);

    if (loading) {
        return (
            <div className={styles.loaderWrapper}>
                <div className={styles.spinner} />
            </div>
        );
    }

    if (!order) {
        return (
            <div className={styles.notFound}>
                <h2>Заказ не найден</h2>
                <Link to="/">На главную</Link>
            </div>
        );
    }

    const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.pending;

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                {/* Иконка успеха */}
                <div className={styles.successIcon}>✓</div>

                <h1 className={styles.title}>Заказ успешно оформлен!</h1>
                <p className={styles.subtitle}>
                    Спасибо за покупку. Мы свяжемся с вами в ближайшее время.
                </p>

                {/* Номер заказа */}
                <div className={styles.orderNumberBlock}>
                    <span className={styles.orderNumberLabel}>Номер заказа:</span>
                    <span className={styles.orderNumber}>{order.orderNumber}</span>
                </div>

                {/* Детали заказа */}
                <div className={styles.detailsCard}>

                    {/* Статус */}
                    <div className={styles.detailRow}>
                        <span className={styles.detailKey}>Статус</span>
                        <span
                            className={styles.statusBadge}
                            style={{ background: statusInfo.color }}
                        >
                            {statusInfo.label}
                        </span>
                    </div>

                    {/* Дата */}
                    <div className={styles.detailRow}>
                        <span className={styles.detailKey}>Дата заказа</span>
                        <span className={styles.detailValue}>
                            {new Date(order.createdAt).toLocaleString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>

                    {/* Доставка */}
                    <div className={styles.detailRow}>
                        <span className={styles.detailKey}>Доставка</span>
                        <span className={styles.detailValue}>
                            {DELIVERY_LABELS[order.deliveryType]}
                        </span>
                    </div>

                    {/* Оплата */}
                    <div className={styles.detailRow}>
                        <span className={styles.detailKey}>Оплата</span>
                        <span className={styles.detailValue}>
                            {PAYMENT_LABELS[order.paymentType]}
                        </span>
                    </div>

                    {/* Контактная информация */}
                    <div className={styles.detailRow}>
                        <span className={styles.detailKey}>Получатель</span>
                        <span className={styles.detailValue}>
                            {order.contactInfo.name}
                        </span>
                    </div>

                    <div className={styles.detailRow}>
                        <span className={styles.detailKey}>Телефон</span>
                        <span className={styles.detailValue}>
                            {order.contactInfo.phone}
                        </span>
                    </div>

                    <div className={styles.detailRow}>
                        <span className={styles.detailKey}>Адрес</span>
                        <span className={styles.detailValue}>
                            {order.contactInfo.address}
                        </span>
                    </div>

                </div>

                {/* Состав заказа */}
                <div className={styles.itemsCard}>
                    <h2 className={styles.itemsTitle}>Состав заказа</h2>

                    <div className={styles.itemsList}>
                        {order.items.map((item, idx) => (
                            <div key={idx} className={styles.item}>
                                <img
                                    src={
                                        item.image
                                            ? `${process.env.REACT_APP_API_URL
                                                ?.replace('/api', '')}/${item.image}`
                                            : '/placeholder.jpg'
                                    }
                                    alt={item.name}
                                    className={styles.itemImage}
                                />
                                <div className={styles.itemInfo}>
                                    <p className={styles.itemName}>{item.name}</p>
                                    <p className={styles.itemQty}>
                                        {item.quantity} шт. × {item.price.toLocaleString('ru-RU')} ₽
                                    </p>
                                </div>
                                <span className={styles.itemTotal}>
                                    {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.orderTotal}>
                        <span>Итого:</span>
                        <span className={styles.orderTotalPrice}>
                            {order.totalPrice.toLocaleString('ru-RU')} ₽
                        </span>
                    </div>
                </div>

                {/* Кнопки навигации */}
                <div className={styles.actions}>
                    <Link to="/catalog" className={styles.catalogBtn}>
                        Продолжить покупки
                    </Link>
                    <Link to="/profile/orders" className={styles.ordersBtn}>
                        Мои заказы
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default OrderSuccessPage;
