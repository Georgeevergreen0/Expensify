import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from "state/auth";
import settingsReducer from "state/settings";


const rootReducer = combineReducers({
    auth: authReducer,
    settings: settingsReducer
});

export const store = configureStore({
    reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;

