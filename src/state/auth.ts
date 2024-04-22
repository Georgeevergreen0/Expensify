import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'state';

const initialState = {
    user: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.user = action.payload;
        },
    },
})

// Action creators are generated for each case reducer function
export const { setUser } = authSlice.actions
// Selectors
export const authSelector = (state: RootState) => state.auth;
// Reducer
export default authSlice.reducer

