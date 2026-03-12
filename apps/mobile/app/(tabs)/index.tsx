import {
  StyleSheet,
  Button,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { RootState } from "@/store";

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Mock state for current product being added (will be moved to Redux later)
  const [currentProduct, setCurrentProduct] = useState<{
    barcode?: string;
    name?: string;
    brand?: string;
    photoMain?: string;
    step?: string;
  } | null>(null);

  const handleAddProduct = () => {
    router.push("/add-product");
  };

  const handleContinueProduct = () => {
    if (currentProduct?.barcode) {
      router.push(`/add-product/${currentProduct.barcode}`);
    }
  };

  const handleClearProduct = () => {
    Alert.alert(
      "Clear Product",
      "Are you sure you want to clear the current product? All progress will be lost.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => setCurrentProduct(null),
        },
      ],
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        InsideFood
      </ThemedText>

      <ThemedText style={styles.subtitle}>Add products to help us</ThemedText>

      {currentProduct ? (
        <ThemedView style={styles.currentProductContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Current Product
          </ThemedText>

          <ThemedView style={styles.productCard}>
            {currentProduct.photoMain && (
              <Image
                source={{ uri: currentProduct.photoMain }}
                style={styles.productImage}
              />
            )}

            <ThemedView style={styles.productInfo}>
              <ThemedText style={styles.productName}>
                {currentProduct.name || "Unnamed Product"}
              </ThemedText>

              {currentProduct.brand && (
                <ThemedText style={styles.productBrand}>
                  {currentProduct.brand}
                </ThemedText>
              )}

              <ThemedText style={styles.productBarcode}>
                Barcode: {currentProduct.barcode}
              </ThemedText>

              {currentProduct.step && (
                <ThemedText style={styles.productStep}>
                  Step: {currentProduct.step}
                </ThemedText>
              )}
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.buttonContainer}>
            <Button title="Continue Adding" onPress={handleContinueProduct} />
            <ThemedView style={styles.buttonSpacer} />
            <Button
              title="Clear Product"
              onPress={handleClearProduct}
              color="#FF3B30"
            />
          </ThemedView>
        </ThemedView>
      ) : (
        <ThemedView style={styles.emptyStateContainer}>
          <ThemedText style={styles.emptyStateText}>
            No product is currently being added
          </ThemedText>
        </ThemedView>
      )}

      <ThemedView style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <ThemedText style={styles.addButtonText}>
            ➕ Add New Product
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
    opacity: 0.7,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  currentProductContainer: {
    marginBottom: 32,
  },
  productCard: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  productInfo: {
    gap: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
  },
  productBrand: {
    fontSize: 16,
    opacity: 0.8,
  },
  productBarcode: {
    fontSize: 14,
    fontFamily: "monospace",
    opacity: 0.6,
  },
  productStep: {
    fontSize: 14,
    opacity: 0.6,
    fontStyle: "italic",
  },
  buttonContainer: {
    gap: 8,
  },
  buttonSpacer: {
    height: 8,
  },
  emptyStateContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    marginBottom: 32,
  },
  emptyStateText: {
    textAlign: "center",
    opacity: 0.6,
  },
  addButtonContainer: {
    marginBottom: 32,
  },
  addButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
