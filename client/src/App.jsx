import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from './store/slices/authSlice';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import CatalogPage from './pages/CatalogPage/CatalogPage';
import ProductPage from './pages/ProductPage/ProductPage';
import CartPage from './pages/CartPage/CartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage/OrderSuccessPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AdminPage from './pages/AdminPage/AdminPage';
import BlogPage from './pages/BlogPage/BlogPage';
import BlogPostPage from './pages/BlogPostPage/BlogPostPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

// Защищённый маршрут
const PrivateRoute = ({ children }) => {
    const { token } = useSelector((state) => state.auth);
    return token ? children : <Navigate to="/login" replace />;
};

// Маршрут только для администратора
const AdminRoute = ({ children }) => {
    const { user, token } = useSelector((state) => state.auth);
    if (!token) return <Navigate to="/login" replace />;
    if (user?.role !== 'admin') return <Navigate to="/" replace />;
    return children;
};

const App = () => {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);

    // Восстанавливаем сессию при перезагрузке страницы
    useEffect(() => {
        if (token) {
            dispatch(fetchProfile());
        }
    }, [dispatch, token]);

    return (
        <BrowserRouter>
            <div className="app">
                <Header />
                <main className="main-content">
                    <Routes>

                        {/* ── Публичные маршруты ── */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/catalog" element={<CatalogPage />} />
                        <Route path="/product/:id" element={<ProductPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/blog" element={<BlogPage />} />
                        <Route path="/blog/:id" element={<BlogPostPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* ── Защищённые маршруты (только авторизованные) ── */}
                        <Route
                            path="/checkout"
                            element={
                                <PrivateRoute>
                                    <CheckoutPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/order-success/:id"
                            element={
                                <PrivateRoute>
                                    <OrderSuccessPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile/*"
                            element={
                                <PrivateRoute>
                                    <ProfilePage />
                                </PrivateRoute>
                            }
                        />

                        {/* ── Административные маршруты ── */}
                        <Route
                            path="/admin/*"
                            element={
                                <AdminRoute>
                                    <AdminPage />
                                </AdminRoute>
                            }
                        />

                        {/* ── 404 ── */}
                        <Route path="*" element={<NotFoundPage />} />

                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
};

export default App;
