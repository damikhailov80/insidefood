import { Button, StyleSheet, TextInput, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

interface BarcodeScanStepProps {
  onBarcodeScanned: (barcode: string) => void;
  onCancel: () => void;
}

export function BarcodeScanStep({
  onBarcodeScanned,
  onCancel,
}: BarcodeScanStepProps) {
  const [manualBarcode, setManualBarcode] = useState("");
  const router = useRouter();

  const handleManualEntry = () => {
    if (!manualBarcode.trim()) {
      Alert.alert("Error", "Please enter a barcode");
      return;
    }

    if (manualBarcode.length < 8) {
      Alert.alert("Error", "Barcode must be at least 8 digits");
      return;
    }

    onBarcodeScanned(manualBarcode.trim());
  };

  const handleScanBarcode = () => {
    router.push("/scan?returnTo=add-product");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Step 0: Scan Barcode
      </ThemedText>

      <ThemedView style={styles.instructionContainer}>
        <ThemedText style={styles.instructionText}>
          Scan the barcode on the product package or enter it manually
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.scanSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Scan with Camera
        </ThemedText>

        <ThemedView style={styles.scanPlaceholder}>
          <ThemedText style={styles.scanPlaceholderText}>
            📷 Tap to open barcode scanner
          </ThemedText>
        </ThemedView>

        <Button title="Scan Barcode" onPress={handleScanBarcode} />
      </ThemedView>

      <ThemedView style={styles.divider}>
        <ThemedText style={styles.dividerText}>OR</ThemedText>
      </ThemedView>

      <ThemedView style={styles.manualSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Enter Manually
        </ThemedText>

        <TextInput
          style={styles.barcodeInput}
          value={manualBarcode}
          onChangeText={setManualBarcode}
          placeholder="Enter barcode (e.g. 1234567890123)"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={20}
        />

        <Button
          title="Continue with Manual Entry"
          onPress={handleManualEntry}
          disabled={!manualBarcode.trim()}
        />
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <Button title="Cancel" onPress={onCancel} color="#666" />
      </ThemedView>
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
  instructionContainer: {
    backgroundColor: "rgba(0, 123, 255, 0.1)",
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
  },
  instructionText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  scanSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    textAlign: "center",
  },
  scanPlaceholder: {
    height: 120,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  scanPlaceholderText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  divider: {
    alignItems: "center",
    marginVertical: 24,
  },
  dividerText: {
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.5,
  },
  manualSection: {
    marginBottom: 32,
  },
  barcodeInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 44,
    marginBottom: 16,
    fontFamily: "monospace",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: "auto",
  },
});
