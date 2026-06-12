import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Создать заказ
export const createOrder = createAsyncThunk(
    'orders/create',
    async (orderData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/orders', orderData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

// Получить заказы пользователя
export const fetchUserOrders = createAsyncThunk(
    'orders/fetchMy',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/orders/my');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        list: [],
        currentOrder: null,
        loading: false,
        error: null,
        successCreate: false,
    },
    reducers: {
        resetOrderSuccess(state) {
            state.successCreate = false;
            state.currentOrder = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.successCreate = false;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.successCreate = true;
                state.currentOrder = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetOrderSuccess } = orderSlice.actions;
export default orderSlice.reducer;
