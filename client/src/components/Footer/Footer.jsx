import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

const Footer = () => (
    <footer className={styles.footer}>
        <div className={styles.container}>

            <div className={styles.grid}>

                {/* Логотип и описание */}
                <div className={styles.brand}>
                    <Link to="/" className={styles.logo}>
                        🏕️ <span>ПикникШоп</span>
                    </Link>
                    <p className={styles.brandDesc}>
                        Всё необходимое для активного отдыха на природе.
                        Качественное снаряжение с доставкой по всей России.
                    </p>
                </div>

                {/* Каталог */}
                <div className={styles.col}>
                    <h4 className={styles.colTitle}>Каталог</h4>
                    <ul className={styles.colList}>
                        <li><Link to="/catalog">Все товары</Link></li>
                        <li><Link to="/catalog?sort=newest">Новинки</Link></li>
                        <li><Link to="/catalog?sort=rating">Популярные</Link></li>
                    </ul>
                </div>

                {/* Покупателям */}
                <div className={styles.col}>
                    <h4 className={styles.colTitle}>Покупателям</h4>
                    <ul className={styles.colList}>
                        <li><Link to="/profile">Личный кабинет</Link></li>
                        <li><Link to="/profile/orders">Мои заказы</Link></li>
                        <li><Link to="/cart">Корзина</Link></li>
                    </ul>
                </div>

                {/* Контакты */}
                <div className={styles.col}>
                    <h4 className={styles.colTitle}>Контакты</h4>
                    <ul className={styles.colList}>
                        <li>📞 8-800-123-45-67</li>
                        <li>✉️ info@picnicshop.ru</li>
                        <li>🕐 Пн–Пт: 9:00–18:00</li>
                    </ul>
                </div>

            </div>

            <div className={styles.bottom}>
                <p>© {new Date().getFullYear()} ПикникШоп. Все права защищены.</p>
            </div>

        </div>
    </footer>
);

export default Footer;
