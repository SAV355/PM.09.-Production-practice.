import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder, resetOrderSuccess } from '../../store/slices/orderSlice';
import { clearCart, selectCartItems, selectCartTotalPrice } from '../../store/slices/cartSlice';
import styles from './CheckoutPage.module.scss';

const DELIVERY_OPTIONS = [
    { value: 'courier', label: '🚚 Курьерская доставка', desc: 'Доставка до двери, 1–3 дня' },
    { value: 'pickup', label: '🏪 Самовывоз', desc: 'Из нашего магазина, бесплатно' },
    { value: 'post', label: '📦 Почта России', desc: 'Доставка по России, 5–14 дней' },
];

const PAYMENT_OPTIONS = [
    { value: 'cash', label: '💵 Наличными при получении', desc: 'Оплата курьеру или в магазине' },
    { value: 'card', label: '💳 Онлайн-оплата картой', desc: 'Visa, Mastercard, МИР' },
];

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(selectCartItems);
    const totalPrice = useSelector(selectCartTotalPrice);
    const { user } = useSelector((state) => state.auth);
    const { loading, error, successCreate, currentOrder } =
        useSelector((state) => state.orders);

    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        deliveryType: 'courier',
        paymentType: 'cash',
    });

    const [errors, setErrors] = useState({});

    // Валидация формы
    const validate = () => {
        const newErrors = {};
        if (!form.name.trim())
            newErrors.name = 'Введите имя';
        if (!form.phone.trim())
            newErrors.phone = 'Введите номер телефона';
        else if (/^[\d\s\+\-\(\)]{7,15}$/.test(form.phone))
            newErrors.phone = 'Некорректный номер телефона';
        if (!form.address.trim())
            newErrors.address = 'Введите адрес доставки';
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const orderData = {
            contactInfo: {
                name: form.name,
                phone: form.phone,
                address: form.address,
            },
            items: items.map((item) => ({
                product: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.images?.[0] || '',
            })),
            deliveryType: form.deliveryType,
            paymentType: form.paymentType,
        };

        const result = await dispatch(createOrder(orderData));

        if (createOrder.fulfilled.match(result)) {
            dispatch(clearCart());
            navigate(`/order-success/${result.payload._id}`);
        }
    };

    // Если корзина пуста — редирект
    if (items.length === 0 && !successCreate) {
        return (
            <div className={styles.emptyCart}>
                <h2>Корзина пуста</h2>
                <button onClick={() => navigate('/catalog')}>
                    В каталог
                </button>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>Оформление заказа</h1>

                <form onSubmit={handleSubmit} className={styles.layout}>

                    {/* ===== ЛЕВАЯ КОЛОНКА ===== */}
                    <div className={styles.formColumn}>

                        {/* Контактная информация */}
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>
                                <span className={styles.step}>1</span>
                                Контактная информация
                            </h2>

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

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Номер телефона *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="+7 (999) 123-45-67"
                                    className={`${styles.input} ${errors.phone ? styles.inputError : ''
                                        }`}
                                />
                                {errors.phone && (
                                    <span className={styles.errorMsg}>{errors.phone}</span>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Адрес доставки *</label>
                                <textarea
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="Город, улица, дом, квартира"
                                    rows={3}
                                    className={`${styles.textarea} ${errors.address ? styles.inputError : ''
                                        }`}
                                />
                                {errors.address && (
                                    <span className={styles.errorMsg}>{errors.address}</span>
                                )}
                            </div>
                        </div>

                        {/* Способ доставки */}
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>
                                <span className={styles.step}>2</span>
                                Способ доставки
                            </h2>
                            <div className={styles.optionsList}>
                                {DELIVERY_OPTIONS.map((opt) => (
                                    <label
                                        key={opt.value}
                                        className={`${styles.optionCard} ${form.deliveryType === opt.value
                                                ? styles.optionCardActive
                                                : ''
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="deliveryType"
                                            value={opt.value}
                                            checked={form.deliveryType === opt.value}
                                            onChange={handleChange}
                                            className={styles.radioInput}
                                        />
                                        <div className={styles.optionContent}>
                                            <span className={styles.optionLabel}>
                                                {opt.label}
                                            </span>
                                            <span className={styles.optionDesc}>
                                                {opt.desc}
                                            </span>
                                        </div>
                                        {form.deliveryType === opt.value && (
                                            <span className={styles.optionCheck}>✓</span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Способ оплаты */}
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>
                                <span className={styles.step}>3</span>
                                Способ оплаты
                            </h2>
                            <div className={styles.optionsList}>
                                {PAYMENT_OPTIONS.map((opt) => (
                                    <label
                                        key={opt.value}
                                        className={`${styles.optionCard} ${form.paymentType === opt.value
                                                ? styles.optionCardActive
                                                : ''
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentType"
                                            value={opt.value}
                                            checked={form.paymentType === opt.value}
                                            onChange={handleChange}
                                            className={styles.radioInput}
                                        />
                                        <div className={styles.optionContent}>
                                            <span className={styles.optionLabel}>
                                                {opt.label}
                                            </span>
                                            <span className={styles.optionDesc}>
                                                {opt.desc}
                                            </span>
                                        </div>
                                        {form.paymentType === opt.value && (
                                            <span className={styles.optionCheck}>✓</span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* ===== ПРАВАЯ КОЛОНКА — ИТОГО ===== */}
                    <div className={styles.summaryColumn}>
                        <div className={styles.summaryCard}>
                            <h2 className={styles.cardTitle}>
                                <span className={styles.step}>4</span>
                                Ваш заказ
                            </h2>

                            {/* Список товаров */}
                            <div className={styles.orderItems}>
                                {items.map((item) => (
                                    <div key={item._id} className={styles.orderItem}>
                                        <img
                                            src={
                                                item.images?.[0]
                                                    ? `${process.env.REACT_APP_API_URL
                                                        ?.replace('/api', '')}/${item.images[0]}`
                                                    : '/placeholder.jpg'
                                            }
                                            alt={item.name}
                                            className={styles.orderItemImage}
                                        />
                                        <div className={styles.orderItemInfo}>
                                            <p className={styles.orderItemName}>{item.name}</p>
                                            <p className={styles.orderItemQty}>
                                                {item.quantity} шт. × {item.price.toLocaleString('ru-RU')} ₽
                                            </p>
                                        </div>
                                        <span className={styles.orderItemTotal}>
                                            {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.summaryDivider} />

                            {/* Итоговая сумма */}
                            <div className={styles.totalRow}>
                                <span>Итого:</span>
                                <span className={styles.totalPrice}>
                                    {totalPrice.toLocaleString('ru-RU')} ₽
                                </span>
                            </div>

                            {/* Ошибка */}
                            {error && (
                                <p className={styles.submitError}>{error}</p>
                            )}

                            {/* Кнопка подтверждения */}
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={loading}
                            >
                                {loading
                                    ? 'Оформление...'
                                    : '✓ Подтвердить заказ'}
                            </button>

                            <p className={styles.agreement}>
                                Нажимая кнопку, вы соглашаетесь с условиями
                                обработки персональных данных
                            </p>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
