import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { useEffect } from "react";
import "react-native-reanimated";

import { store } from "@/store";
import { initializeTestData } from "@/utils/testData";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  // Initialize test data for development
  useEffect(() => {
    initializeTestData();
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider>
        <ThemeProvider value={DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="product/[barcode]"
              options={{ title: "Product details" }}
            />
          </Stack>
          <StatusBar style="dark" />
        </ThemeProvider>
      </PaperProvider>
    </Provider>
  );
}
