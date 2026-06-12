import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Регистрация
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/users/register', userData);
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Ошибка регистрации'
            );
        }
    }
);

// Авторизация
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/users/login', credentials);
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Ошибка авторизации'
            );
        }
    }
);

// Получить профиль
export const fetchProfile = createAsyncThunk(
    'auth/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/users/profile');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

// Обновить профиль
export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const { data } = await api.put('/users/profile', profileData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null,
    },
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Регистрация
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Авторизация
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Профиль
        builder
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
