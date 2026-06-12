import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../../../store/slices/orderSlice';
import styles from './ProfileTabs.module.scss';

const STATUS_CONFIG = {
    pending: { label: 'Ожидает обработки', color: '#f59e0b', bg: '#fffbeb' },
    processing: { label: 'В обработке', color: '#3b82f6', bg: '#eff6ff' },
    shipped: { label: 'Отправлен', color: '#8b5cf6', bg: '#f5f3ff' },
    delivered: { label: 'Доставлен', color: '#2c7a4b', bg: '#f0faf4' },
    cancelled: { label: 'Отменён', color: '#e74c3c', bg: '#fef2f2' },
};

const DELIVERY_LABELS = {
    courier: '🚚 Курьер',
    pickup: '🏪 Самовывоз',
    post: '📦 Почта',
};

const OrderCard = ({ order }) => {
    const [expanded, setExpanded] = useState(false);
    const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

    return (
        <div className={styles.orderCard}>

            {/* Шапка заказа */}
            <div
                className={styles.orderHeader}
                onClick={() => setExpanded((prev) => !prev)}
            >
                <div className={styles.orderHeaderLeft}>
                    <span className={styles.orderNumber}>
                        {order.orderNumber}
                    </span>
                    <span className={styles.orderDate}>
                        {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </span>
                </div>

                <div className={styles.orderHeaderRight}>
                    <span
                        className={styles.orderStatus}
                        style={{ color: status.color, background: status.bg }}
                    >
                        {status.label}
                    </span>
                    <span className={styles.orderTotal}>
                        {order.totalPrice.toLocaleString('ru-RU')} ₽
                    </span>
                    <span className={styles.expandIcon}>
                        {expanded ? '▲' : '▼'}
                    </span>
                </div>
            </div>

            {/* Раскрывающийся блок */}
            {expanded && (
                <div className={styles.orderBody}>

                    {/* Мета-информация */}
                    <div className={styles.orderMeta}>
                        <div className={styles.orderMetaItem}>
                            <span className={styles.metaLabel}>Доставка:</span>
                            <span className={styles.metaValue}>
                                {DELIVERY_LABELS[order.deliveryType]}
                            </span>
                        </div>
                        <div className={styles.orderMetaItem}>
                            <span className={styles.metaLabel}>Адрес:</span>
                            <span className={styles.metaValue}>
                                {order.contactInfo.address}
                            </span>
                        </div>
                        <div className={styles.orderMetaItem}>
                            <span className={styles.metaLabel}>Телефон:</span>
                            <span className={styles.metaValue}>
                                {order.contactInfo.phone}
                            </span>
                        </div>
                    </div>

                    {/* Список товаров */}
                    <div className={styles.orderItems}>
                        {order.items.map((item, idx) => (
                            <div key={idx} className={styles.orderItem}>
                                <img
                                    src={
                                        item.image
                                            ? `${process.env.REACT_APP_API_URL
                                                ?.replace('/api', '')}/${item.image}`
                                            : '/placeholder.jpg'
                                    }
                                    alt={item.name}
                                    className={styles.orderItemImg}
                                />
                                <div className={styles.orderItemInfo}>
                                    <p className={styles.orderItemName}>{item.name}</p>
                                    <p className={styles.orderItemQty}>
                                        {item.quantity} шт. × {item.price.toLocaleString('ru-RU')} ₽
                                    </p>
                                </div>
                                <span className={styles.orderItemSum}>
                                    {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Итого */}
                    <div className={styles.orderFooter}>
                        <span>Итого по заказу:</span>
                        <strong className={styles.orderFooterTotal}>
                            {order.totalPrice.toLocaleString('ru-RU')} ₽
                        </strong>
                    </div>

                </div>
            )}
        </div>
    );
};

const ProfileOrders = () => {
    const dispatch = useDispatch();
    const { list: orders, loading } =
        useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchUserOrders());
    }, [dispatch]);

    if (loading) {
        return (
            <div className={styles.card}>
                <div className={styles.loader}>
                    <div className={styles.spinner} />
                    <p>Загрузка заказов...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.card}>
            <h2 className={styles.cardTitle}>
                История заказов
                <span className={styles.countBadge}>{orders.length}</span>
            </h2>

            {orders.length === 0 ? (
                <div className={styles.emptyOrders}>
                    <p className={styles.emptyIcon}>📦</p>
                    <p className={styles.emptyText}>У вас пока нет заказов</p>
                    <a href="/catalog" className={styles.shopLink}>
                        Перейти в каталог
                    </a>
                </div>
            ) : (
                <div className={styles.ordersList}>
                    {orders.map((order) => (
                        <OrderCard key={order._id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfileOrders;
