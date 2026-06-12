import { createSlice } from '@reduxjs/toolkit';

// Загрузка корзины из localStorage
const loadCart = () => {
    try {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

// Сохранение корзины в localStorage
const saveCart = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: loadCart(),
    },
    reducers: {
        // Добавить товар в корзину
        addToCart(state, action) {
            const product = action.payload;
            const existing = state.items.find(i => i._id === product._id);

            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ ...product, quantity: 1 });
            }
            saveCart(state.items);
        },

        // Удалить товар из корзины
        removeFromCart(state, action) {
            state.items = state.items.filter(i => i._id !== action.payload);
            saveCart(state.items);
        },

        // Изменить количество
        updateQuantity(state, action) {
            const { id, quantity } = action.payload;
            const item = state.items.find(i => i._id === id);
            if (item) {
                item.quantity = Math.max(1, quantity);
            }
            saveCart(state.items);
        },

        // Очистить корзину
        clearCart(state) {
            state.items = [];
            saveCart([]);
        },
    },
});

// Селекторы
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalPrice = (state) =>
    state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartItemsCount = (state) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0);

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
    cartSlice.actions;
export default cartSlice.reducer;
