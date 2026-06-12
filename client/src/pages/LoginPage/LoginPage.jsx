import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/slices/authSlice';
import styles from './AuthPage.module.scss';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state) => state.auth);

    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});

    // Если уже авторизован — редирект
    useEffect(() => {
        if (token) navigate('/profile');
        return () => dispatch(clearError());
    }, [token, navigate, dispatch]);

    const validate = () => {
        const e = {};
        if (!form.email.trim())
            e.email = 'Введите email';
        else if (!/\S+@\S+\.\S+/.test(form.email))
            e.email = 'Некорректный email';
        if (!form.password)
            e.password = 'Введите пароль';
        return e;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        dispatch(loginUser(form));
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>

                {/* Логотип */}
                <div className={styles.logo}>🏕️</div>
                <h1 className={styles.title}>Вход в аккаунт</h1>
                <p className={styles.subtitle}>
                    Нет аккаунта?{' '}
                    <Link to="/register" className={styles.authLink}>
                        Зарегистрироваться
                    </Link>
                </p>

                {/* Серверная ошибка */}
                {error && (
                    <div className={styles.serverError}>{error}</div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>

                    {/* Email */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="example@mail.ru"
                            className={`${styles.input} ${errors.email ? styles.inputError : ''
                                }`}
                            autoComplete="email"
                        />
                        {errors.email && (
                            <span className={styles.errorMsg}>{errors.email}</span>
                        )}
                    </div>

                    {/* Пароль */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Пароль</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Введите пароль"
                            className={`${styles.input} ${errors.password ? styles.inputError : ''
                                }`}
                            autoComplete="current-password"
                        />
                        {errors.password && (
                            <span className={styles.errorMsg}>{errors.password}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default LoginPage;
