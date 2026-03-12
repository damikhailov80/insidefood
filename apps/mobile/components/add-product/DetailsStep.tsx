import { Button, StyleSheet, TextInput } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

interface DetailsStepProps {
  description: string;
  price: string;
  energy: string;
  fat: string;
  carbs: string;
  protein: string;
  loading: boolean;
  onDescriptionChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onEnergyChange: (value: string) => void;
  onFatChange: (value: string) => void;
  onCarbsChange: (value: string) => void;
  onProteinChange: (value: string) => void;
  onSave: () => void;
  onBack: () => void;
}

export function DetailsStep({
  description,
  price,
  energy,
  fat,
  carbs,
  protein,
  loading,
  onDescriptionChange,
  onPriceChange,
  onEnergyChange,
  onFatChange,
  onCarbsChange,
  onProteinChange,
  onSave,
  onBack,
}: DetailsStepProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Step 3: Additional Information
      </ThemedText>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Description</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={onDescriptionChange}
          placeholder="Enter product description"
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Price ($)</ThemedText>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={onPriceChange}
          placeholder="0.00"
          placeholderTextColor="#999"
          keyboardType="decimal-pad"
        />
      </ThemedView>

      <ThemedView style={styles.nutritionSection}>
        <ThemedText type="title" style={styles.nutritionTitle}>
          Nutrition Facts (per 100g)
        </ThemedText>

        <ThemedView style={styles.nutritionGrid}>
          <ThemedView style={styles.nutritionItem}>
            <ThemedText type="subtitle">Energy (kcal)</ThemedText>
            <TextInput
              style={styles.nutritionInput}
              value={energy}
              onChangeText={onEnergyChange}
              placeholder="0"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </ThemedView>

          <ThemedView style={styles.nutritionItem}>
            <ThemedText type="subtitle">Fat (g)</ThemedText>
            <TextInput
              style={styles.nutritionInput}
              value={fat}
              onChangeText={onFatChange}
              placeholder="0"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />
          </ThemedView>

          <ThemedView style={styles.nutritionItem}>
            <ThemedText type="subtitle">Carbs (g)</ThemedText>
            <TextInput
              style={styles.nutritionInput}
              value={carbs}
              onChangeText={onCarbsChange}
              placeholder="0"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />
          </ThemedView>

          <ThemedView style={styles.nutritionItem}>
            <ThemedText type="subtitle">Protein (g)</ThemedText>
            <TextInput
              style={styles.nutritionInput}
              value={protein}
              onChangeText={onProteinChange}
              placeholder="0"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <Button
          title={loading ? "Saving..." : "Save Product"}
          onPress={onSave}
          disabled={loading}
        />
        <ThemedView style={styles.buttonSpacer} />
        <Button title="Back" onPress={onBack} color="#666" />
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
  textArea: {
    height: 80,
    textAlignVertical: "top",
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
  },
  nutritionInput: {
    marginTop: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 36,
  },
  buttonContainer: {
    marginTop: 32,
    marginBottom: 40,
  },
  buttonSpacer: {
    height: 12,
  },
});
