import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScannedProduct, ScannedProductsState } from './types';

const STORAGE_KEY = 'scannedProducts';

// Async thunks
export const loadScannedProducts = createAsyncThunk(
    'scannedProducts/load',
    async () => {
        try {
            // Check if AsyncStorage is available
            if (!AsyncStorage) {
                console.warn('AsyncStorage is not available');
                return [];
            }

            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const products = JSON.parse(stored);
                return products.sort((a: ScannedProduct, b: ScannedProduct) =>
                    new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()
                );
            }
            return [];
        } catch (error) {
            console.error('Error loading scanned products:', error);
            return [];
        }
    }
);

export const addScannedProduct = createAsyncThunk(
    'scannedProducts/add',
    async (product: Omit<ScannedProduct, 'scannedAt'>) => {
        try {
            // Check if AsyncStorage is available
            if (!AsyncStorage) {
                console.warn('AsyncStorage is not available');
                return null;
            }

            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            const products = stored ? JSON.parse(stored) : [];

            const newProduct: ScannedProduct = {
                ...product,
                scannedAt: new Date().toISOString(),
            };

            // Check if this barcode was already scanned recently (within last hour)
            const recentScan = products.find((p: ScannedProduct) =>
                p.barcode === product.barcode &&
                new Date().getTime() - new Date(p.scannedAt).getTime() < 3600000
            );

            if (!recentScan) {
                products.unshift(newProduct);
                // Keep only last 100 scans
                const limitedProducts = products.slice(0, 100);
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(limitedProducts));
                return newProduct;
            }

            return null;
        } catch (error) {
            console.error('Error saving scanned product:', error);
            return null;
        }
    }
);

export const clearScannedProducts = createAsyncThunk(
    'scannedProducts/clear',
    async () => {
        try {
            // Check if AsyncStorage is available
            if (!AsyncStorage) {
                console.warn('AsyncStorage is not available');
                return;
            }

            await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing scanned products:', error);
            // Don't throw, just log the error
        }
    }
);

const initialState: ScannedProductsState = {
    products: [],
    isLoading: false,
};

const scannedProductsSlice = createSlice({
    name: 'scannedProducts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Load products
            .addCase(loadScannedProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loadScannedProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload;
            })
            .addCase(loadScannedProducts.rejected, (state) => {
                state.isLoading = false;
            })
            // Add product
            .addCase(addScannedProduct.fulfilled, (state, action) => {
                if (action.payload) {
                    state.products.unshift(action.payload);
                    // Keep only last 100 scans
                    state.products = state.products.slice(0, 100);
                }
            })
            // Clear products
            .addCase(clearScannedProducts.fulfilled, (state) => {
                state.products = [];
            });
    },
});

export default scannedProductsSlice.reducer;