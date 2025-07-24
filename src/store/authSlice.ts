import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginFormData, User } from '../types/auth.types';
import { AuthService } from '../services/authService';

const initialState: AuthState = {
    user: AuthService.getCurrentUser(),
    token: AuthService.getToken(),
    isAuthenticated: AuthService.isAuthenticated(),
    isLoading: false,
    error: null,
};

export const loginUser = createAsyncThunk('auth/login', async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
        const response = await AuthService.login(credentials);
        if (response.status === 'success' && response.data) {
            return {
                user: response.data.user,
                token: response.data.access_token,
            };
        }
        throw new Error(response.message);
    } catch (error: any) {
        return rejectWithValue(error.message || 'Login failed');
    }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await AuthService.logout();
        return true;
    } catch (error: any) {
        return rejectWithValue(error.message || 'Logout failed');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        updateUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            })
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
