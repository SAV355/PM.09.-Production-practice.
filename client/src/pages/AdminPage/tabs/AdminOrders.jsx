import React, { useEffect, useState } from 'react';
import api from '../../../utils/api';
import styles from './AdminTabs.module.scss';

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Ожидает обработки' },
    { value: 'processing', label: 'В обработке' },
    { value: 'shipped', label: 'Отправлен' },
    { value: 'delivered', label: 'Доставлен' },
    { value: 'cancelled', label: 'Отменён' },
];

const STATUS_COLORS = {
    pending: '#f59e0b',
    processing: '#3b82f6',
    shipped: '#8b5cf6',
    delivered: '#2c7a4b',
    cancelled: '#e74c3c',
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        api.get('/orders')
            .then(({ data }) => setOrders(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdating(orderId);
        try {
            const { data } = await api.put(
                `/orders/${orderId}/status`,
                { status: newStatus }
            );
            setOrders((prev) =>
                prev.map((o) => (o._id === orderId ? data : o))
            );
        } catch (error) {
            console.error('Ошибка обновления статуса:', error);
            alert('Не удалось обновить статус заказа');
        } finally {
            setUpdating(null);
        }
    };

    if (loading) {
        return (
            <div className={styles.loader}>
                <div className={styles.spinner} />
                <p>Загрузка заказов...</p>
            </div>
        );
    }

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                    Управление заказами
                    <span className={styles.countBadge}>{orders.length}</span>
                </h2>
            </div>

            {orders.length === 0 ? (
                <div className={styles.emptyBlock}>
                    <p className={styles.emptyIcon}>🛒</p>
                    <p className={styles.emptyText}>Заказов пока нет</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>№ Заказа</th>
                                <th>Дата</th>
                                <th>Покупатель</th>
                                <th>Телефон</th>
                                <th>Состав</th>
                                <th>Сумма</th>
                                <th>Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className={styles.tableRow}>

                                    {/* Номер заказа */}
                                    <td>
                                        <span className={styles.orderNum}>
                                            {order.orderNumber}
                                        </span>
                                    </td>

                                    {/* Дата */}
                                    <td>
                                        <span className={styles.dateText}>
                                            {new Date(order.createdAt).toLocaleDateString(
                                                'ru-RU',
                                                {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                }
                                            )}
                                        </span>
                                    </td>

                                    {/* Покупатель */}
                                    <td>
                                        <div className={styles.customerCell}>
                                            <span className={styles.customerName}>
                                                {order.contactInfo.name}
                                            </span>
                                            {order.user?.email && (
                                                <span className={styles.customerEmail}>
                                                    {order.user.email}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Телефон */}
                                    <td>
                                        <span className={styles.phoneText}>
                                            {order.contactInfo.phone}
                                        </span>
                                    </td>

                                    {/* Состав заказа */}
                                    <td>
                                        <div className={styles.itemsCell}>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className={styles.orderItemRow}>
                                                    <span className={styles.orderItemName}>
                                                        {item.name}
                                                    </span>
                                                    <span className={styles.orderItemQty}>
                                                        × {item.quantity}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>

                                    {/* Сумма */}
                                    <td>
                                        <span className={styles.priceText}>
                                            {order.totalPrice.toLocaleString('ru-RU')} ₽
                                        </span>
                                    </td>

                                    {/* Статус — выпадающий список */}
                                    <td>
                                        <div className={styles.statusCell}>
                                            <select
                                                value={order.status}
                                                onChange={(e) =>
                                                    handleStatusChange(order._id, e.target.value)
                                                }
                                                disabled={updating === order._id}
                                                className={styles.statusSelect}
                                                style={{
                                                    borderColor: STATUS_COLORS[order.status],
                                                    color: STATUS_COLORS[order.status],
                                                }}
                                            >
                                                {STATUS_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {updating === order._id && (
                                                <span className={styles.updatingSpinner} />
                                            )}
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
