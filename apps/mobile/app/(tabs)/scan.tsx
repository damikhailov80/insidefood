import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useCallback } from "react";
import { Button, StyleSheet, Text, View, Dimensions } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

const { width, height } = Dimensions.get("window");
const FRAME_SIZE = Math.min(width, height) * 0.85;

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const router = useRouter();

  // Re-enable scanning when screen comes back into focus
  useFocusEffect(
    useCallback(() => {
      setIsScanning(true);
      return () => {
        setIsScanning(false);
      };
    }, []),
  );

  if (!permission) {
    return <ThemedView style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.message}>
          We need your permission to show the camera
        </ThemedText>
        <Button onPress={requestPermission} title="Grant permission" />
      </ThemedView>
    );
  }

  const handleBarcodeScanned = ({ data }: { type: string; data: string }) => {
    if (!isScanning) return;

    setIsScanning(false);
    router.push(`/product/${data}`);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8", "code128", "code39"],
        }}
      />

      <View style={styles.overlay}>
        <View style={styles.topOverlay} />

        <View style={styles.middleRow}>
          <View style={styles.sideOverlay} />
          <View
            style={[styles.scanArea, { width: FRAME_SIZE, height: FRAME_SIZE }]}
          >
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <View style={styles.sideOverlay} />
        </View>

        <View style={styles.bottomOverlay}>
          <Text style={styles.instructionText}>
            Position barcode within frame
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  middleRow: {
    flexDirection: "row",
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  scanArea: {
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 50,
    height: 50,
    borderColor: "#fff",
    borderWidth: 5,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  instructionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
