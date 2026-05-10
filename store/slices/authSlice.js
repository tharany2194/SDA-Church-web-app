import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';
import Cookies from 'js-cookie';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

// Extract a human-readable message from an Axios error
function extractError(err, fallback) {
  if (!err.response) {
    // Network error — server unreachable
    return 'Unable to connect to the server. Please check your connection or try again later.';
  }
  const { status, data } = err.response;
  if (data?.message) return data.message;
  if (status === 409) return 'An account with this email already exists.';
  if (status === 422) return 'Please check your details and try again.';
  if (status === 429) return 'Too many attempts. Please wait a few minutes and try again.';
  if (status === 500) return 'Server error. Please try again later.';
  return fallback;
}

const COOKIE_OPTS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    Cookies.set('accessToken', data.data.accessToken, COOKIE_OPTS);
    return data.data.user;
  } catch (err) {
    return rejectWithValue(extractError(err, 'Registration failed. Please try again.'));
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    Cookies.set('accessToken', data.data.accessToken, COOKIE_OPTS);
    return data.data.user;
  } catch (err) {
    return rejectWithValue(extractError(err, 'Login failed. Please check your credentials.'));
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout');
    Cookies.remove('accessToken');
  } catch {
    Cookies.remove('accessToken');
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(register.pending, (state) => { state.isLoading = true; state.error = null; });
    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Login
    builder.addCase(login.pending, (state) => { state.isLoading = true; state.error = null; });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });

    // Fetch current user (on app load)
    builder.addCase(fetchCurrentUser.pending, (state) => { state.isLoading = true; });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isInitialized = true;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.isLoading = false;
      state.isInitialized = true;
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
