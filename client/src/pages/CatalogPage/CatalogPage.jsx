import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, setFilters, setPage } from '../../store/slices/productSlice';
import ProductCard from '../../components/ProductCard/ProductCard';
import api from '../../utils/api';
import styles from './CatalogPage.module.scss';

const CatalogPage = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { list, loading, pages, currentPage, filters } =
        useSelector((state) => state.products);

    const [categories, setCategories] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    // Загрузка категорий
    useEffect(() => {
        api.get('/categories').then(({ data }) => setCategories(data));
    }, []);

    // Применяем category из URL при первом входе
    useEffect(() => {
        const catFromUrl = searchParams.get('category');
        if (catFromUrl) {
            dispatch(setFilters({ category: catFromUrl }));
        }
    }, []);

    // Загрузка товаров при изменении фильтров
    useEffect(() => {
        dispatch(fetchProducts(filters));
    }, [dispatch, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        dispatch(setFilters({ [name]: value }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        dispatch(setFilters({ search: searchInput }));
    };

    const handlePageChange = (page) => {
        dispatch(setPage(page));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                {/* ===== САЙДБАР С ФИЛЬТРАМИ ===== */}
                <aside className={styles.sidebar}>
                    <h2 className={styles.sidebarTitle}>Фильтры</h2>

                    {/* Поиск */}
                    <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                        <label className={styles.filterLabel}>Поиск</label>
                        <div className={styles.searchRow}>
                            <input
                                type="text"
                                placeholder="Название товара..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className={styles.input}
                            />
                            <button type="submit" className={styles.searchBtn}>
                                🔍
                            </button>
                        </div>
                    </form>

                    {/* Категория */}
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Категория</label>
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            className={styles.select}
                        >
                            <option value="">Все категории</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Цена */}
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Цена (₽)</label>
                        <div className={styles.priceRow}>
                            <input
                                type="number"
                                name="minPrice"
                                placeholder="От"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                                className={styles.input}
                                min="0"
                            />
                            <span className={styles.priceSep}>—</span>
                            <input
                                type="number"
                                name="maxPrice"
                                placeholder="До"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                className={styles.input}
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Рейтинг */}
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>
                            Минимальный рейтинг
                        </label>
                        <select
                            name="minRating"
                            value={filters.minRating}
                            onChange={handleFilterChange}
                            className={styles.select}
                        >
                            <option value="">Любой</option>
                            <option value="4">4★ и выше</option>
                            <option value="3">3★ и выше</option>
                            <option value="2">2★ и выше</option>
                        </select>
                    </div>

                    {/* Сброс */}
                    <button
                        className={styles.resetBtn}
                        onClick={() => {
                            dispatch(setFilters({
                                category: '',
                                minPrice: '',
                                maxPrice: '',
                                minRating: '',
                                search: '',
                            }));
                            setSearchInput('');
                        }}
                    >
                        Сбросить фильтры
                    </button>
                </aside>

                {/* ===== ОСНОВНОЙ КОНТЕНТ ===== */}
                <div className={styles.main}>

                    {/* Сортировка и счётчик */}
                    <div className={styles.toolbar}>
                        <p className={styles.resultsCount}>
                            Найдено товаров: <strong>{list.length}</strong>
                        </p>
                        <select
                            name="sort"
                            value={filters.sort}
                            onChange={handleFilterChange}
                            className={styles.sortSelect}
                        >
                            <option value="newest">   По новизне</option>
                            <option value="price_asc"> Цена: по возрастанию</option>
                            <option value="price_desc">Цена: по убыванию</option>
                            <option value="rating">   По рейтингу</option>
                        </select>
                    </div>

                    {/* Сетка товаров */}
                    {loading ? (
                        <div className={styles.loader}>
                            <div className={styles.spinner} />
                            <p>Загрузка товаров...</p>
                        </div>
                    ) : list.length === 0 ? (
                        <div className={styles.empty}>
                            <p>😔 Товары не найдены</p>
                            <p>Попробуйте изменить параметры фильтрации</p>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {list.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Пагинация */}
                    {pages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.pageBtn}
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                ← Назад
                            </button>

                            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    className={`${styles.pageBtn} ${p === currentPage ? styles.pageBtnActive : ''
                                        }`}
                                    onClick={() => handlePageChange(p)}
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                className={styles.pageBtn}
                                disabled={currentPage === pages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Вперёд →
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CatalogPage;
