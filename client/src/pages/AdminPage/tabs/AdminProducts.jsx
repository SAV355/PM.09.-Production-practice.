import React, { useEffect, useState } from 'react';
import api from '../../../utils/api';
import styles from './AdminTabs.module.scss';

const EMPTY_FORM = {
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    isRecommended: false,
    characteristics: [],
};

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [charInput, setCharInput] = useState({ key: '', value: '' });
    const [searchQuery, setSearchQuery] = useState('');

    // Загрузка данных
    useEffect(() => {
        Promise.all([
            api.get('/products?limit=100'),
            api.get('/categories'),
        ])
            .then(([prodRes, catRes]) => {
                setProducts(prodRes.data.products);
                setCategories(catRes.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Открыть модалку для создания
    const handleOpenCreate = () => {
        setEditProduct(null);
        setForm(EMPTY_FORM);
        setCharInput({ key: '', value: '' });
        setShowModal(true);
    };

    // Открыть модалку для редактирования
    const handleOpenEdit = (product) => {
        setEditProduct(product);
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category?._id || product.category,
            isRecommended: product.isRecommended,
            characteristics: product.characteristics || [],
        });
        setCharInput({ key: '', value: '' });
        setShowModal(true);
    };

    // Закрыть модалку
    const handleCloseModal = () => {
        setShowModal(false);
        setEditProduct(null);
        setForm(EMPTY_FORM);
    };

    // Изменение полей формы
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Добавить характеристику
    const handleAddChar = () => {
        if (!charInput.key.trim() || !charInput.value.trim()) return;
        setForm((prev) => ({
            ...prev,
            characteristics: [
                ...prev.characteristics,
                { key: charInput.key.trim(), value: charInput.value.trim() },
            ],
        }));
        setCharInput({ key: '', value: '' });
    };

    // Удалить характеристику
    const handleRemoveChar = (idx) => {
        setForm((prev) => ({
            ...prev,
            characteristics: prev.characteristics.filter((_, i) => i !== idx),
        }));
    };

    // Сохранить товар (создать или обновить)
    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.price || !form.category) {
            alert('Заполните обязательные поля: название, цена, категория');
            return;
        }

        setSaving(true);
        try {
            if (editProduct) {
                // Обновление
                const { data } = await api.put(
                    `/products/${editProduct._id}`,
                    form
                );
                setProducts((prev) =>
                    prev.map((p) => (p._id === editProduct._id ? data : p))
                );
            } else {
                // Создание
                const { data } = await api.post('/products', form);
                setProducts((prev) => [data, ...prev]);
            }
            handleCloseModal();
        } catch (error) {
            alert(error.response?.data?.message || 'Ошибка сохранения товара');
        } finally {
            setSaving(false);
        }
    };

    // Удалить товар
    const handleDelete = async (productId, productName) => {
        if (!window.confirm(`Удалить товар «${productName}»?`)) return;
        setDeleting(productId);
        try {
            await api.delete(`/products/${productId}`);
            setProducts((prev) => prev.filter((p) => p._id !== productId));
        } catch (error) {
            alert('Ошибка при удалении товара');
        } finally {
            setDeleting(null);
        }
    };

    // Фильтрация по поиску
    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className={styles.loader}>
                <div className={styles.spinner} />
                <p>Загрузка товаров...</p>
            </div>
        );
    }

    return (
        <div className={styles.section}>

            {/* Шапка секции */}
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                    Управление товарами
                    <span className={styles.countBadge}>
                        {filteredProducts.length}
                    </span>
                </h2>
                <button
                    className={styles.addBtn}
                    onClick={handleOpenCreate}
                >
                    + Добавить товар
                </button>
            </div>

            {/* Поиск */}
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="🔍 Поиск по названию..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {/* Таблица товаров */}
            {filteredProducts.length === 0 ? (
                <div className={styles.emptyBlock}>
                    <p className={styles.emptyIcon}>📦</p>
                    <p className={styles.emptyText}>Товары не найдены</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th>Категория</th>
                                <th>Цена</th>
                                <th>Остаток</th>
                                <th>Рейтинг</th>
                                <th>Рекомендуем</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className={styles.tableRow}>

                                    <td>
                                        <span className={styles.productName}>
                                            {product.name}
                                        </span>
                                    </td>

                                    <td>
                                        <span className={styles.categoryTag}>
                                            {product.category?.name || '—'}
                                        </span>
                                    </td>

                                    <td>
                                        <span className={styles.priceText}>
                                            {product.price.toLocaleString('ru-RU')} ₽
                                        </span>
                                    </td>

                                    <td>
                                        <span className={`${styles.stockBadge} ${product.stock > 0
                                                ? styles.stockIn
                                                : styles.stockOut
                                            }`}>
                                            {product.stock} шт.
                                        </span>
                                    </td>

                                    <td>
                                        <span className={styles.ratingText}>
                                            ★ {product.rating}
                                            <small> ({product.reviewCount})</small>
                                        </span>
                                    </td>

                                    <td>
                                        <span className={`${styles.recBadge} ${product.isRecommended
                                                ? styles.recBadgeOn
                                                : styles.recBadgeOff
                                            }`}>
                                            {product.isRecommended ? '✓ Да' : '✗ Нет'}
                                        </span>
                                    </td>

                                    <td>
                                        <div className={styles.actionBtns}>
                                            <button
                                                className={styles.editBtn}
                                                onClick={() => handleOpenEdit(product)}
                                            >
                                                ✏️ Изменить
                                            </button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() =>
                                                    handleDelete(product._id, product.name)
                                                }
                                                disabled={deleting === product._id}
                                            >
                                                {deleting === product._id
                                                    ? '...'
                                                    : '🗑 Удалить'}
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ===== МОДАЛЬНОЕ ОКНО ===== */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>
                                {editProduct ? '✏️ Редактировать товар' : '➕ Новый товар'}
                            </h3>
                            <button
                                className={styles.modalClose}
                                onClick={handleCloseModal}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSave} className={styles.modalForm}>

                            {/* Название */}
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    Название *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleFormChange}
                                    placeholder="Название товара"
                                    className={styles.formInput}
                                    required
                                />
                            </div>

                            {/* Описание */}
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Описание *</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleFormChange}
                                    placeholder="Описание товара..."
                                    rows={3}
                                    className={styles.formTextarea}
                                    required
                                />
                            </div>

                            {/* Цена и остаток */}
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Цена (₽) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={handleFormChange}
                                        placeholder="0"
                                        min="0"
                                        className={styles.formInput}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>
                                        Остаток (шт.)
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={form.stock}
                                        onChange={handleFormChange}
                                        placeholder="0"
                                        min="0"
                                        className={styles.formInput}
                                    />
                                </div>
                            </div>

                            {/* Категория */}
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Категория *</label>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleFormChange}
                                    className={styles.formSelect}
                                    required
                                >
                                    <option value="">Выберите категорию</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Рекомендуемый */}
                            <div className={styles.formCheckbox}>
                                <input
                                    type="checkbox"
                                    id="isRecommended"
                                    name="isRecommended"
                                    checked={form.isRecommended}
                                    onChange={handleFormChange}
                                    className={styles.checkbox}
                                />
                                <label
                                    htmlFor="isRecommended"
                                    className={styles.checkboxLabel}
                                >
                                    Отображать в «Рекомендуемых»
                                </label>
                            </div>

                            {/* Характеристики */}
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    Характеристики
                                </label>

                                {/* Список добавленных */}
                                {form.characteristics.length > 0 && (
                                    <div className={styles.charList}>
                                        {form.characteristics.map((char, idx) => (
                                            <div key={idx} className={styles.charItem}>
                                                <span className={styles.charKey}>
                                                    {char.key}:
                                                </span>
                                                <span className={styles.charVal}>
                                                    {char.value}
                                                </span>
                                                <button
                                                    type="button"
                                                    className={styles.charRemove}
                                                    onClick={() => handleRemoveChar(idx)}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Форма добавления характеристики */}
                                <div className={styles.charInputRow}>
                                    <input
                                        type="text"
                                        placeholder="Параметр"
                                        value={charInput.key}
                                        onChange={(e) =>
                                            setCharInput((prev) => ({
                                                ...prev,
                                                key: e.target.value,
                                            }))
                                        }
                                        className={styles.charInputField}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Значение"
                                        value={charInput.value}
                                        onChange={(e) =>
                                            setCharInput((prev) => ({
                                                ...prev,
                                                value: e.target.value,
                                            }))
                                        }
                                        className={styles.charInputField}
                                    />
                                    <button
                                        type="button"
                                        className={styles.charAddBtn}
                                        onClick={handleAddChar}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Кнопки */}
                            <div className={styles.modalFooter}>
                                <button
                                    type="button"
                                    className={styles.cancelBtn}
                                    onClick={handleCloseModal}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className={styles.saveBtn}
                                    disabled={saving}
                                >
                                    {saving
                                        ? 'Сохранение...'
                                        : editProduct
                                            ? 'Сохранить изменения'
                                            : 'Создать товар'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminProducts;
