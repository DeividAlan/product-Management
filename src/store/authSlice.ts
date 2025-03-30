import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

type User = {
  name: string;
  email: string;
  image: string;
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const storedAuth = sessionStorage.getItem('teste-matera:auth');
const initialState: AuthState = storedAuth
  ? { ...JSON.parse(storedAuth), isAuthenticated: true }
  : {
      user: null,
      token: null,
      isAuthenticated: false,
    };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      sessionStorage.setItem(
        'teste-matera:auth',
        JSON.stringify(action.payload)
      );
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      sessionStorage.removeItem('teste-matera:auth');
    },
  },
});

export const { login, logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
