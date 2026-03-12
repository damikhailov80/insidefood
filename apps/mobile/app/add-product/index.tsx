import { useRouter, Stack } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { ThemedView } from "@/components/themed-view";
import {
  BarcodeScanStep,
  PhotoMainStep,
  RecognitionStep,
  ConfirmBasicInfoStep,
  DetailsStep,
} from "../../components/add-product";

type Step =
  | "barcodeScan"
  | "photoMain"
  | "recognition"
  | "confirmation"
  | "details";

export default function AddProductScreen() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<Step>("barcodeScan");
  const [barcode, setBarcode] = useState("");
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [energy, setEnergy] = useState("");
  const [fat, setFat] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [photoMain, setPhotoMain] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBarcodeScanned = (scannedBarcode: string) => {
    setBarcode(scannedBarcode);
    setCurrentStep("photoMain");
  };

  const handlePhotoTaken = async (uri: string) => {
    setPhotoMain(uri);
    setCurrentStep("recognition");
    await recognizeProduct(uri);
  };

  const recognizeProduct = async (imageUri: string) => {
    try {
      // TODO: API call for product recognition will be implemented here
      // Simulating delay and setting test data for now
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Test data - will come from backend in real implementation
      setProductName("Pasteurized Milk");
      setBrand("Prostokvashino");

      setCurrentStep("confirmation");
    } catch (error) {
      Alert.alert("Error", "Failed to recognize product");
      setCurrentStep("photoMain");
    }
  };

  const handleConfirmData = () => {
    if (!productName.trim()) {
      Alert.alert("Error", "Product name is required");
      return;
    }

    if (!brand.trim()) {
      Alert.alert("Error", "Brand is required");
      return;
    }

    setCurrentStep("details");
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      // TODO: Implement API call to save product
      Alert.alert("Success", "Product will be saved (API integration needed)", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "barcodeScan":
        return (
          <BarcodeScanStep
            onBarcodeScanned={handleBarcodeScanned}
            onCancel={() => router.back()}
          />
        );
      case "photoMain":
        return (
          <PhotoMainStep
            barcode={barcode}
            onPhotoTaken={handlePhotoTaken}
            onCancel={() => router.back()}
          />
        );
      case "recognition":
        return photoMain ? <RecognitionStep photoUri={photoMain} /> : null;
      case "confirmation":
        return photoMain ? (
          <ConfirmBasicInfoStep
            photoUri={photoMain}
            productName={productName}
            brand={brand}
            onProductNameChange={setProductName}
            onBrandChange={setBrand}
            onConfirm={handleConfirmData}
            onRetakePhoto={() => setCurrentStep("photoMain")}
          />
        ) : null;
      case "details":
        return (
          <DetailsStep
            description={description}
            price={price}
            energy={energy}
            fat={fat}
            carbs={carbs}
            protein={protein}
            loading={loading}
            onDescriptionChange={setDescription}
            onPriceChange={setPrice}
            onEnergyChange={setEnergy}
            onFatChange={setFat}
            onCarbsChange={setCarbs}
            onProteinChange={setProtein}
            onSave={handleSave}
            onBack={() => setCurrentStep("confirmation")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Add Product" }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <ThemedView style={styles.content}>{renderCurrentStep()}</ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
});
