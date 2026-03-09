import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_URL } from '@/config/api';

interface Product {
    id: number;
    barcode: string;
    name: string;
    description?: string;
    price?: number;
    createdAt: string;
    updatedAt: string;
}

export default function ProductScreen() {
    const { barcode } = useLocalSearchParams<{ barcode: string }>();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [barcode]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setNotFound(false);
            const url = `${API_URL}/product/${barcode}`;
            const response = await fetch(url);

            if (response.status === 404) {
                setNotFound(true);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to load product');
            }

            const data = await response.json();
            setProduct(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load product';
            Alert.alert('Error', errorMessage, [
                {
                    text: 'OK',
                    onPress: () => router.back(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <ThemedView style={styles.container}>
                <ActivityIndicator size="large" />
                <ThemedText style={styles.loadingText}>Loading product...</ThemedText>
            </ThemedView>
        );
    }

    if (notFound) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText type="title" style={styles.notFoundTitle}>Oops</ThemedText>
                <ThemedText style={styles.notFoundText}>
                    Looks like this product is not in the database yet
                </ThemedText>
                <Button title="Back to Scanner" onPress={() => router.back()} />
            </ThemedView>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <ScrollView style={styles.scrollView}>
            <ThemedView style={styles.content}>
                <ThemedText type="title" style={styles.title}>{product.name}</ThemedText>

                <ThemedView style={styles.section}>
                    <ThemedText type="subtitle">Barcode</ThemedText>
                    <ThemedText style={styles.value}>{product.barcode}</ThemedText>
                </ThemedView>

                {product.description && (
                    <ThemedView style={styles.section}>
                        <ThemedText type="subtitle">Description</ThemedText>
                        <ThemedText style={styles.value}>{product.description}</ThemedText>
                    </ThemedView>
                )}

                {product.price && (
                    <ThemedView style={styles.section}>
                        <ThemedText type="subtitle">Price</ThemedText>
                        <ThemedText style={styles.value}>${product.price.toFixed(2)}</ThemedText>
                    </ThemedView>
                )}

                <ThemedView style={styles.buttonContainer}>
                    <Button title="Scan Another" onPress={() => router.back()} />
                </ThemedView>
            </ThemedView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    title: {
        marginBottom: 24,
    },
    section: {
        marginBottom: 20,
    },
    value: {
        marginTop: 8,
        fontSize: 16,
    },
    loadingText: {
        marginTop: 16,
    },
    notFoundTitle: {
        marginBottom: 16,
    },
    notFoundText: {
        marginBottom: 24,
        textAlign: 'center',
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 32,
    },
});
