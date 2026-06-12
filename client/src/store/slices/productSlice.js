import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Получить список товаров
export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/products', { params });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

// Получить один товар
export const fetchProductById = createAsyncThunk(
    'products/fetchOne',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/products/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

// Получить рекомендуемые товары
export const fetchRecommended = createAsyncThunk(
    'products/fetchRecommended',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/products/recommended');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        list: [],
        recommended: [],
        current: null,
        total: 0,
        pages: 1,
        currentPage: 1,
        loading: false,
        error: null,
        filters: {
            category: '',
            minPrice: '',
            maxPrice: '',
            minRating: '',
            sort: 'newest',
            search: '',
            page: 1,
        },
    },
    reducers: {
        setFilters(state, action) {
            state.filters = { ...state.filters, ...action.payload, page: 1 };
        },
        setPage(state, action) {
            state.filters.page = action.payload;
        },
        clearCurrent(state) {
            state.current = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Список товаров
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.products;
                state.total = action.payload.total;
                state.pages = action.payload.pages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Один товар
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.current = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.current = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Рекомендуемые
            .addCase(fetchRecommended.fulfilled, (state, action) => {
                state.recommended = action.payload;
            });
    },
});

export const { setFilters, setPage, clearCurrent } = productSlice.actions;
export default productSlice.reducer;
