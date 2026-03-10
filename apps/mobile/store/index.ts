import { configureStore } from '@reduxjs/toolkit';
import scannedProductsReducer from './scannedProductsSlice';

export const store = configureStore({
    reducer: {
        scannedProducts: scannedProductsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;