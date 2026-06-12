import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import ProfileInfo from './tabs/ProfileInfo';
import ProfileOrders from './tabs/ProfileOrders';
import styles from './ProfilePage.module.scss';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const navLinks = [
        { to: '/profile', label: '👤 Мои данные', end: true },
        { to: '/profile/orders', label: '📦 Мои заказы', end: false },
    ];

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                {/* ── Сайдбар ── */}
                <aside className={styles.sidebar}>

                    {/* Аватар и имя */}
                    <div className={styles.userCard}>
                        <div className={styles.avatar}>
                            {user?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className={styles.userInfo}>
                            <p className={styles.userName}>{user?.name}</p>
                            <p className={styles.userEmail}>{user?.email}</p>
                        </div>
                    </div>

                    {/* Навигация */}
                    <nav className={styles.nav}>
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className={({ isActive }) =>
                                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Кнопка выхода */}
                    <button
                        className={styles.logoutBtn}
                        onClick={handleLogout}
                    >
                        🚪 Выйти из аккаунта
                    </button>

                </aside>

                {/* ── Основной контент ── */}
                <div className={styles.content}>
                    <Routes>
                        <Route index element={<ProfileInfo />} />
                        <Route path="orders" element={<ProfileOrders />} />
                        <Route path="orders/:id" element={<ProfileOrders />} />
                    </Routes>
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;
