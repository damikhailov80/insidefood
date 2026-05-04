import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScannedProduct, ScannedProductsState } from "./types";

const STORAGE_KEY = "scannedProducts";

// Async thunks
export const loadScannedProducts = createAsyncThunk(
  "scannedProducts/load",
  async () => {
    if (!AsyncStorage) {
      throw new Error("AsyncStorage is not available");
    }

    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const products = JSON.parse(stored);
      return products.sort(
        (a: ScannedProduct, b: ScannedProduct) =>
          new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime(),
      );
    }
    return [];
  },
);

export const addScannedProduct = createAsyncThunk(
  "scannedProducts/add",
  async (product: Omit<ScannedProduct, "scannedAt">) => {
    if (!AsyncStorage) {
      throw new Error("AsyncStorage is not available");
    }

    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const products = stored ? JSON.parse(stored) : [];

    const newProduct: ScannedProduct = {
      ...product,
      scannedAt: new Date().toISOString(),
    };

    // Check if this barcode was already scanned recently (within last hour)
    const recentScan = products.find(
      (p: ScannedProduct) =>
        p.barcode === product.barcode &&
        new Date().getTime() - new Date(p.scannedAt).getTime() < 3600000,
    );

    if (!recentScan) {
      products.unshift(newProduct);
      // Keep only last 100 scans
      const limitedProducts = products.slice(0, 100);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(limitedProducts));
      return newProduct;
    }

    return null;
  },
);

export const clearScannedProducts = createAsyncThunk(
  "scannedProducts/clear",
  async () => {
    if (!AsyncStorage) {
      throw new Error("AsyncStorage is not available");
    }

    await AsyncStorage.removeItem(STORAGE_KEY);
  },
);

const initialState: ScannedProductsState = {
  products: [],
  isLoading: false,
};

const scannedProductsSlice = createSlice({
  name: "scannedProducts",
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
      .addCase(loadScannedProducts.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Failed to load scanned products:", action.error.message);
      })
      // Add product
      .addCase(addScannedProduct.fulfilled, (state, action) => {
        if (action.payload) {
          state.products.unshift(action.payload);
          // Keep only last 100 scans
          state.products = state.products.slice(0, 100);
        }
      })
      .addCase(addScannedProduct.rejected, (state, action) => {
        console.error("Failed to add scanned product:", action.error.message);
      })
      // Clear products
      .addCase(clearScannedProducts.fulfilled, (state) => {
        state.products = [];
      })
      .addCase(clearScannedProducts.rejected, (state, action) => {
        console.error(
          "Failed to clear scanned products:",
          action.error.message,
        );
      });
  },
});

export default scannedProductsSlice.reducer;
