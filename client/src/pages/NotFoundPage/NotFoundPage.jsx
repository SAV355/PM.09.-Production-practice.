import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.scss';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>
            <div className={styles.content}>

                <div className={styles.code}>404</div>

                <h1 className={styles.title}>Страница не найдена</h1>

                <p className={styles.text}>
                    Возможно, страница была удалена или вы перешли
                    по неверной ссылке
                </p>

                <div className={styles.actions}>
                    <button
                        className={styles.backBtn}
                        onClick={() => navigate(-1)}
                    >
                        ← Назад
                    </button>
                    <Link to="/" className={styles.homeBtn}>
                        🏠 На главную
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default NotFoundPage;
