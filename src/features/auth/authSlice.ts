import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import { auth } from '../../firebase';

export type AuthState = {
    user: User | null;
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    message: string;
}

const initialState: AuthState = {
    user: auth.currentUser || null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        }
    },
});

export const {reset, login} = authSlice.actions;

export default authSlice.reducer;