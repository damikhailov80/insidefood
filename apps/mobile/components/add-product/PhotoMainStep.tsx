import { Alert, Button, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

interface PhotoMainStepProps {
  barcode: string;
  onPhotoTaken: (uri: string) => void;
  onCancel: () => void;
}

export function PhotoMainStep({
  barcode,
  onPhotoTaken,
  onCancel,
}: PhotoMainStepProps) {
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera permission is needed to take photos",
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onPhotoTaken(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onPhotoTaken(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert("Add Photo", "Choose how to add a product photo", [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose from Gallery", onPress: pickFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Step 1: Package Photo
      </ThemedText>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Barcode</ThemedText>
        <ThemedText style={styles.barcodeText}>{barcode}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.instructionContainer}>
        <ThemedText style={styles.instructionText}>
          Take a photo of the product package so that the name and brand are
          clearly visible
        </ThemedText>
      </ThemedView>

      <TouchableOpacity onPress={showImagePicker} style={styles.photoButton}>
        <ThemedText style={styles.photoButtonText}>
          📷 Take Package Photo
        </ThemedText>
      </TouchableOpacity>

      <Button title="Cancel" onPress={onCancel} color="#666" />
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
  section: {
    marginBottom: 20,
  },
  barcodeText: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: "monospace",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    padding: 8,
    borderRadius: 4,
  },
  instructionContainer: {
    backgroundColor: "rgba(0, 123, 255, 0.1)",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  instructionText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  photoButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  photoButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
