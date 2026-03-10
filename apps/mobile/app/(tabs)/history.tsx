import React, { useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { loadScannedProducts, clearScannedProducts } from '@/store/scannedProductsSlice';
import { ScannedProduct } from '@/store/types';

export default function HistoryScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const dispatch = useAppDispatch();
    const { products, isLoading } = useAppSelector((state) => state.scannedProducts);

    useEffect(() => {
        dispatch(loadScannedProducts());
    }, [dispatch]);

    useFocusEffect(
        useCallback(() => {
            dispatch(loadScannedProducts());
        }, [dispatch])
    );

    const handleClearHistory = () => {
        Alert.alert(
            'Clear History',
            'Are you sure you want to delete all scanning history?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => dispatch(clearScannedProducts()),
                },
            ]
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderProduct = ({ item }: { item: ScannedProduct }) => (
        <TouchableOpacity
            style={[
                styles.productItem,
                { borderBottomColor: Colors[colorScheme ?? 'light'].border }
            ]}
            onPress={() => router.push(`/product/${item.barcode}?fromHistory=true`)}
        >
            <ThemedView style={styles.productContent}>
                <ThemedText style={styles.productName}>
                    {item.name || `Product ${item.barcode}`}
                </ThemedText>
                <ThemedText style={styles.barcode}>
                    Barcode: {item.barcode}
                </ThemedText>
                <ThemedText style={styles.date}>
                    {formatDate(item.scannedAt)}
                </ThemedText>
            </ThemedView>
            <IconSymbol
                name="chevron.right"
                size={20}
                color={Colors[colorScheme ?? 'light'].tabIconDefault}
            />
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText style={styles.loadingText}>Loading...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.header}>
                <ThemedText style={styles.title}>Scan History</ThemedText>
                {products.length > 0 && (
                    <TouchableOpacity onPress={handleClearHistory} style={styles.clearButton}>
                        <IconSymbol
                            name="trash"
                            size={24}
                            color={Colors[colorScheme ?? 'light'].destructive}
                        />
                    </TouchableOpacity>
                )}
            </ThemedView>

            {products.length === 0 ? (
                <ThemedView style={styles.emptyState}>
                    <IconSymbol
                        name="clock"
                        size={64}
                        color={Colors[colorScheme ?? 'light'].tabIconDefault}
                    />
                    <ThemedText style={styles.emptyText}>
                        No scanned products yet
                    </ThemedText>
                    <ThemedText style={styles.emptySubtext}>
                        Scan a barcode to see it here
                    </ThemedText>
                </ThemedView>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={(item) => `${item.barcode}-${item.scannedAt}`}
                    style={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    clearButton: {
        padding: 8,
    },
    list: {
        flex: 1,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    productContent: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    barcode: {
        fontSize: 14,
        opacity: 0.7,
        marginBottom: 2,
    },
    date: {
        fontSize: 12,
        opacity: 0.5,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        opacity: 0.7,
        marginTop: 8,
        textAlign: 'center',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 100,
    },
});