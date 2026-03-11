import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { API_URL, MINIO_URL } from "@/config/api";
import { useAppDispatch } from "@/hooks/redux";
import { addScannedProduct } from "@/store/scannedProductsSlice";

interface Product {
  id: number;
  barcode: string;
  name: string;
  brand: string;
  description?: string;
  price?: number;
  energy: number;
  fat: number;
  carbs: number;
  protein: number;
  photoMain: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProductScreen() {
  const { barcode, fromHistory } = useLocalSearchParams<{
    barcode: string;
    fromHistory?: string;
  }>();
  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const isFromHistory = fromHistory === "true";

  const saveToHistory = useCallback(
    (productData: Product | null) => {
      // Don't save to history if coming from history
      if (!isFromHistory) {
        dispatch(
          addScannedProduct({
            barcode: barcode!,
            name: productData?.name,
          }),
        );
      }
    },
    [isFromHistory, barcode, dispatch],
  );

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setNotFound(false);
      const url = `${API_URL}/product/${barcode}`;
      const response = await fetch(url);

      if (response.status === 404) {
        setNotFound(true);
        saveToHistory(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load product");
      }

      const data = await response.json();
      setProduct(data);
      saveToHistory(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load product";
      Alert.alert("Error", errorMessage, [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [barcode, router, saveToHistory]);

  useEffect(() => {
    // Set initial title
    navigation.setOptions({ title: "Product details" });
    fetchProduct();
  }, [barcode, navigation, fetchProduct]);

  useEffect(() => {
    // Update title based on state
    if (loading) {
      navigation.setOptions({ title: "Product details" });
    } else if (notFound) {
      navigation.setOptions({ title: "Product not found" });
    } else if (product) {
      navigation.setOptions({ title: product.name });
    }
  }, [loading, notFound, product, navigation]);

  if (loading) {
    return (
      <ThemedView style={styles.content}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>Loading product...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (notFound) {
    return (
      <ThemedView style={styles.content}>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.notFoundTitle}>
            Oops
          </ThemedText>
          <ThemedText style={styles.notFoundText}>
            Looks like this product is not in the database yet
          </ThemedText>
          <Button
            title={isFromHistory ? "Back" : "Back to Scanner"}
            onPress={() => router.back()}
          />
        </ThemedView>
      </ThemedView>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.content}>
        {product.photoMain && (
          <ThemedView style={styles.photoSection}>
            <Image
              source={{
                uri: product.photoMain.replace(
                  "http://localhost:9000",
                  MINIO_URL,
                ),
              }}
              style={styles.productImage}
              resizeMode="contain"
            />
          </ThemedView>
        )}

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Barcode</ThemedText>
          <ThemedText style={styles.value}>{product.barcode}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Brand</ThemedText>
          <ThemedText style={styles.value}>{product.brand}</ThemedText>
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
            <ThemedText style={styles.value}>
              ${product.price.toFixed(2)}
            </ThemedText>
          </ThemedView>
        )}

        <ThemedView style={styles.nutritionSection}>
          <ThemedText type="title" style={styles.nutritionTitle}>
            Nutrition Facts (per 100g)
          </ThemedText>

          <ThemedView style={styles.nutritionGrid}>
            <ThemedView style={styles.nutritionItem}>
              <ThemedText type="subtitle">Energy</ThemedText>
              <ThemedText style={styles.nutritionValue}>
                {product.energy} kcal
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.nutritionItem}>
              <ThemedText type="subtitle">Fat</ThemedText>
              <ThemedText style={styles.nutritionValue}>
                {product.fat}g
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.nutritionItem}>
              <ThemedText type="subtitle">Carbs</ThemedText>
              <ThemedText style={styles.nutritionValue}>
                {product.carbs}g
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.nutritionItem}>
              <ThemedText type="subtitle">Protein</ThemedText>
              <ThemedText style={styles.nutritionValue}>
                {product.protein}g
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.buttonContainer}>
          <Button
            title={isFromHistory ? "Back" : "Scan Another"}
            onPress={() => router.back()}
          />
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  nutritionSection: {
    marginTop: 24,
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  nutritionTitle: {
    marginBottom: 16,
    textAlign: "center",
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  nutritionItem: {
    width: "48%",
    marginBottom: 12,
    padding: 8,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  nutritionValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    marginTop: 16,
  },
  notFoundTitle: {
    marginBottom: 16,
  },
  notFoundText: {
    marginBottom: 24,
    textAlign: "center",
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 32,
  },
  photoSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
});
