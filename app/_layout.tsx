import "react-native-gesture-handler";

import {
  BricolageGrotesque_400Regular,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
} from "@expo-google-fonts/bricolage-grotesque";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { WeatherProvider } from "@/lib/weather/context";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    BricolageGrotesque_400Regular,
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
  });
  const [skiaReady, setSkiaReady] = useState(Platform.OS !== "web");

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    let active = true;
    void import("@shopify/react-native-skia/lib/module/web/LoadSkiaWeb")
      .then(({ LoadSkiaWeb }) =>
        LoadSkiaWeb({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/canvaskit-wasm@0.41.0/bin/full/${file}`,
        }),
      )
      .then(() => {
        if (active) setSkiaReady(true);
      })
      .catch((reason: unknown) => {
        console.error(reason);
        if (active) setSkiaReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loaded && skiaReady) SplashScreen.hideAsync();
  }, [loaded, skiaReady]);

  if (!loaded || !skiaReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={styles.frame}>
        <WeatherProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#FFFFFF" },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="ciudad"
              options={{ presentation: "modal", animation: "slide_from_bottom" }}
            />
          </Stack>
        </WeatherProvider>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = {
  frame: {
    flex: 1,
    width: "100%" as const,
    maxWidth: 430,
    alignSelf: "center" as const,
    backgroundColor: "#FFFFFF",
  },
};
