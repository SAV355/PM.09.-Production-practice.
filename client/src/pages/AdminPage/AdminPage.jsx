import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import AdminStats from './tabs/AdminStats';
import AdminProducts from './tabs/AdminProducts';
import AdminOrders from './tabs/AdminOrders';
import styles from './AdminPage.module.scss';

const AdminPage = () => {
    const navLinks = [
        { to: '/admin', label: '📊 Статистика', end: true },
        { to: '/admin/products', label: '📦 Товары', end: false },
        { to: '/admin/orders', label: '🛒 Заказы', end: false },
    ];

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                {/* Шапка */}
                <div className={styles.header}>
                    <h1 className={styles.title}>⚙️ Административная панель</h1>
                </div>

                {/* Навигация */}
                <nav className={styles.tabs}>
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) =>
                                `${styles.tab} ${isActive ? styles.tabActive : ''}`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Контент */}
                <div className={styles.content}>
                    <Routes>
                        <Route index element={<AdminStats />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="orders" element={<AdminOrders />} />
                    </Routes>
                </div>

            </div>
        </div>
    );
};

export default AdminPage;
