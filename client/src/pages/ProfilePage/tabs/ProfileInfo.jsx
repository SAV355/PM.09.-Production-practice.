import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../../store/slices/authSlice';
import styles from './ProfileTabs.module.scss';

const ProfileInfo = () => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);

    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });

    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Введите имя';
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

        const result = await dispatch(updateProfile(form));
        if (updateProfile.fulfilled.match(result)) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
    };

    return (
        <div className={styles.card}>
            <h2 className={styles.cardTitle}>Личные данные</h2>

            <form onSubmit={handleSubmit} className={styles.form}>

                {/* Email (только чтение) */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className={`${styles.input} ${styles.inputDisabled}`}
                    />
                    <span className={styles.hint}>
                        Email изменить нельзя
                    </span>
                </div>

                {/* Имя */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Имя и фамилия *</label>
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

                {/* Телефон */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Номер телефона</label>
                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+7 (999) 123-45-67"
                        className={styles.input}
                    />
                </div>

                {/* Адрес */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Адрес доставки</label>
                    <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Город, улица, дом, квартира"
                        rows={3}
                        className={styles.textarea}
                    />
                </div>

                {/* Сообщения */}
                {success && (
                    <div className={styles.successMsg}>
                        ✓ Данные успешно сохранены!
                    </div>
                )}

                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                >
                    {loading ? 'Сохранение...' : 'Сохранить изменения'}
                </button>

            </form>
        </div>
    );
};

export default ProfileInfo;
