import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DecodedToken {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  roles: string[];
}

const initialToken = localStorage.getItem('token');

const initialState: AuthState = {
  token: initialToken,
  isAuthenticated: !!initialToken,
  roles: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      
      try {
        
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedToken: DecodedToken = JSON.parse(atob(base64));
        
        
        const roleClaim = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        
        
        if (roleClaim) {
          state.roles = typeof roleClaim === 'string' ? [roleClaim] : roleClaim;
        } else {
          state.roles = [];
        }
        
        localStorage.setItem('token', token);
      } catch (error) {
        console.error('Token decode error:', error);
        state.roles = [];
      }
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.roles = [];
      localStorage.removeItem('token');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;