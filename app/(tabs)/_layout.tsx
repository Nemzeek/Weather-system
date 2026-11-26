import { Tabs } from "expo-router";

import { BrumaTabBar } from "@/components/bruma/tab-bar";
import { colors } from "@/lib/theme";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BrumaTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.paper },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Zona actual" }} />
      <Tabs.Screen name="pronostico" options={{ title: "Pronóstico" }} />
      <Tabs.Screen name="recordatorios" options={{ title: "Recordatorios" }} />
    </Tabs>
  );
}
