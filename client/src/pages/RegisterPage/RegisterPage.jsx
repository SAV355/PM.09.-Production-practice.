import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../store/slices/authSlice';
import styles from '../LoginPage/AuthPage.module.scss';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state) => state.auth);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (token) navigate('/profile');
        return () => dispatch(clearError());
    }, [token, navigate, dispatch]);

    const validate = () => {
        const e = {};
        if (!form.name.trim())
            e.name = 'Введите имя';
        if (!form.email.trim())
            e.email = 'Введите email';
        else if (!/\S+@\S+\.\S+/.test(form.email))
            e.email = 'Некорректный email';
        if (!form.password)
            e.password = 'Введите пароль';
        else if (form.password.length < 6)
            e.password = 'Минимум 6 символов';
        if (form.password !== form.confirmPassword)
            e.confirmPassword = 'Пароли не совпадают';
        return e;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        dispatch(registerUser({
            name: form.name,
            email: form.email,
            password: form.password,
        }));
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>

                <div className={styles.logo}>🏕️</div>
                <h1 className={styles.title}>Регистрация</h1>
                <p className={styles.subtitle}>
                    Уже есть аккаунт?{' '}
                    <Link to="/login" className={styles.authLink}>
                        Войти
                    </Link>
                </p>

                {error && (
                    <div className={styles.serverError}>{error}</div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>

                    {/* Имя */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Имя и фамилия</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Иван Иванов"
                            className={`${styles.input} ${errors.name ? styles.inputError : ''
                                }`}
                        />
                        {errors.name && (
                            <span className={styles.errorMsg}>{errors.name}</span>
                        )}
                    </div>

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
                            placeholder="Минимум 6 символов"
                            className={`${styles.input} ${errors.password ? styles.inputError : ''
                                }`}
                        />
                        {errors.password && (
                            <span className={styles.errorMsg}>{errors.password}</span>
                        )}
                    </div>

                    {/* Подтверждение пароля */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Подтвердите пароль</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Повторите пароль"
                            className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''
                                }`}
                        />
                        {errors.confirmPassword && (
                            <span className={styles.errorMsg}>
                                {errors.confirmPassword}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? 'Регистрация...' : 'Создать аккаунт'}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
