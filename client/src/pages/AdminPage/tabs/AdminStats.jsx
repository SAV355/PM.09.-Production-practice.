import React, { useEffect, useState } from 'react';
import api from '../../../utils/api';
import styles from './AdminTabs.module.scss';

const STATUS_LABELS = {
    pending: 'Ожидает',
    processing: 'В обработке',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменён',
};

const AdminStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/stats')
            .then(({ data }) => setStats(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className={styles.loader}>
                <div className={styles.spinner} />
                <p>Загрузка статистики...</p>
            </div>
        );
    }

    return (
        <div className={styles.statsPage}>

            {/* ── Карточки метрик ── */}
            <div className={styles.metricsGrid}>
                <div className={`${styles.metricCard} ${styles.metricGreen}`}>
                    <span className={styles.metricIcon}>💰</span>
                    <div>
                        <p className={styles.metricLabel}>Общая выручка</p>
                        <p className={styles.metricValue}>
                            {stats?.totalRevenue?.toLocaleString('ru-RU')} ₽
                        </p>
                    </div>
                </div>

                <div className={`${styles.metricCard} ${styles.metricBlue}`}>
                    <span className={styles.metricIcon}>📦</span>
                    <div>
                        <p className={styles.metricLabel}>Всего заказов</p>
                        <p className={styles.metricValue}>{stats?.totalOrders}</p>
                    </div>
                </div>

                <div className={`${styles.metricCard} ${styles.metricPurple}`}>
                    <span className={styles.metricIcon}>👤</span>
                    <div>
                        <p className={styles.metricLabel}>Пользователей</p>
                        <p className={styles.metricValue}>{stats?.totalUsers}</p>
                    </div>
                </div>
            </div>

            <div className={styles.statsGrid}>

                {/* ── Топ товаров ── */}
                <div className={styles.statsCard}>
                    <h2 className={styles.statsCardTitle}>
                        🏆 Топ-5 товаров по продажам
                    </h2>
                    {stats?.topProducts?.length === 0 ? (
                        <p className={styles.emptyText}>Нет данных</p>
                    ) : (
                        <div className={styles.topList}>
                            {stats?.topProducts?.map((product, idx) => (
                                <div key={product._id} className={styles.topItem}>
                                    <span className={styles.topRank}>#{idx + 1}</span>
                                    <div className={styles.topInfo}>
                                        <p className={styles.topName}>{product.name}</p>
                                        <p className={styles.topSub}>
                                            Продано: {product.totalSold} шт.
                                        </p>
                                    </div>
                                    <span className={styles.topRevenue}>
                                        {product.totalRevenue?.toLocaleString('ru-RU')} ₽
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Заказы по статусам ── */}
                <div className={styles.statsCard}>
                    <h2 className={styles.statsCardTitle}>
                        📊 Заказы по статусам
                    </h2>
                    {stats?.ordersByStatus?.length === 0 ? (
                        <p className={styles.emptyText}>Нет данных</p>
                    ) : (
                        <div className={styles.statusList}>
                            {stats?.ordersByStatus?.map((item) => (
                                <div key={item._id} className={styles.statusItem}>
                                    <span className={styles.statusLabel}>
                                        {STATUS_LABELS[item._id] || item._id}
                                    </span>
                                    <div className={styles.statusBar}>
                                        <div
                                            className={styles.statusBarFill}
                                            style={{
                                                width: `${Math.min(
                                                    (item.count / stats.totalOrders) * 100,
                                                    100
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                    <span className={styles.statusCount}>
                                        {item.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminStats;
