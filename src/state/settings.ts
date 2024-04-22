import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'state';

const initialState = {
    mode: localStorage.getItem("mode") ? localStorage.getItem("mode") : "light",
    color: localStorage.getItem("color") ? localStorage.getItem("color") : "#d32f2f",
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setMode: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.mode = action.payload;
        },
        setColor: (state, action) => {
            state.color = action.payload;
        },
    },
})

// Action creators are generated for each case reducer function
export const { setMode, setColor } = settingsSlice.actions
// Selectors
export const settingsSelector = (state: RootState) => state.settings;
// Reducer
export default settingsSlice.reducer