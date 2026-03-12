import {
  Button,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useState } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

interface ConfirmBasicInfoStepProps {
  photoUri: string;
  productName: string;
  brand: string;
  onProductNameChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onConfirm: () => void;
  onRetakePhoto: () => void;
}

export function ConfirmBasicInfoStep({
  photoUri,
  productName,
  brand,
  onProductNameChange,
  onBrandChange,
  onConfirm,
  onRetakePhoto,
}: ConfirmBasicInfoStepProps) {
  const [showFullImage, setShowFullImage] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Step 2: Confirm Basic Info
      </ThemedText>

      <TouchableOpacity onPress={() => setShowFullImage(true)}>
        <Image source={{ uri: photoUri }} style={styles.photo} />
        <ThemedText style={styles.photoHint}>Tap to view full size</ThemedText>
      </TouchableOpacity>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Product Name *</ThemedText>
        <TextInput
          style={styles.input}
          value={productName}
          onChangeText={onProductNameChange}
          placeholder="Enter product name"
          placeholderTextColor="#999"
          autoCapitalize="words"
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Brand *</ThemedText>
        <TextInput
          style={styles.input}
          value={brand}
          onChangeText={onBrandChange}
          placeholder="Enter brand name"
          placeholderTextColor="#999"
          autoCapitalize="words"
        />
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <Button title="Confirm Data" onPress={onConfirm} />
        <ThemedView style={styles.buttonSpacer} />
        <Button title="Retake Photo" onPress={onRetakePhoto} color="#666" />
      </ThemedView>

      {/* Full Image Modal */}
      <Modal
        visible={showFullImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFullImage(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowFullImage(false)}
          >
            <Image
              source={{ uri: photoUri }}
              style={styles.fullImage}
              resizeMode="contain"
            />
            <ThemedText style={styles.closeHint}>
              Tap anywhere to close
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  photo: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  photoHint: {
    textAlign: "center",
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  input: {
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 44,
  },
  buttonContainer: {
    marginTop: 32,
    marginBottom: 40,
  },
  buttonSpacer: {
    height: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  fullImage: {
    width: "100%",
    height: "80%",
  },
  closeHint: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    opacity: 0.8,
  },
});
