export interface ScannedProduct {
    barcode: string;
    name?: string;
    scannedAt: string;
}

export interface ScannedProductsState {
    products: ScannedProduct[];
    isLoading: boolean;
}