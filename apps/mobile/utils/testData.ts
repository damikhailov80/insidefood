import { ScannedProduct } from '../store/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'scannedProducts';

// Test data for development (using same products as in seed)
export const testScannedProducts: ScannedProduct[] = __DEV__ ? [
    {
        barcode: '5449000000996',
        name: 'Coca-Cola 0.5L',
        scannedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
        barcode: '5449000133323',
        name: 'Sprite 0.5L',
        scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
        barcode: '4014400900016',
        name: "Lay's Classic 150g",
        scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
        barcode: '8000500162000',
        name: 'Nutella 350g',
        scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    },
    {
        barcode: '4601234567890',
        name: 'Milk 2.5% 1L',
        scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    },
    {
        barcode: '4750011848646',
        name: 'Mellenu zefirs',
        scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
    },
] : [];

// Initialize test data in AsyncStorage for development
export const initializeTestData = async () => {
    if (!__DEV__ || !AsyncStorage) return;

    try {
        const existing = await AsyncStorage.getItem(STORAGE_KEY);
        if (!existing && testScannedProducts.length > 0) {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(testScannedProducts));
            console.log('Test data initialized in AsyncStorage');
        }
    } catch (error) {
        console.error('Error initializing test data:', error);
    }
};