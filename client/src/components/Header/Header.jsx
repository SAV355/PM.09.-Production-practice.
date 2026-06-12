import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { selectCartItemsCount } from '../../store/slices/cartSlice';
import styles from './Header.module.scss';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartCount = useSelector(selectCartItemsCount);
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>

                {/* Логотип */}
                <Link to="/" className={styles.logo}>
                    🏕️ <span>ПикникШоп</span>
                </Link>

                {/* Навигация */}
                <nav className={styles.nav}>
                    <Link to="/" className={styles.navLink}>Главная</Link>
                    <Link to="/catalog" className={styles.navLink}>Каталог</Link>
                    <Link to="/blog" className={styles.navLink}>Блог</Link>
                </nav>

                {/* Правая часть */}
                <div className={styles.actions}>

                    {/* Корзина */}
                    <Link to="/cart" className={styles.cartBtn}>
                        🛒
                        {cartCount > 0 && (
                            <span className={styles.cartBadge}>{cartCount}</span>
                        )}
                    </Link>

                    {/* Авторизация */}
                    {user ? (
                        <div className={styles.userMenu}>
                            <Link to="/profile" className={styles.profileLink}>
                                👤 {user.name}
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className={styles.adminLink}>
                                    ⚙️ Админ
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className={styles.logoutBtn}
                            >
                                Выйти
                            </button>
                        </div>
                    ) : (
                        <div className={styles.authLinks}>
                            <Link to="/login" className={styles.loginBtn}>Войти</Link>
                            <Link to="/register" className={styles.registerBtn}>
                                Регистрация
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Header;
