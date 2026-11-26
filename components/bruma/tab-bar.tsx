import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, font, radius, space, type } from "@/lib/theme";

const tabs = [
  { name: "index", label: "Zona actual", icon: "locate-outline", active: "locate" },
  { name: "pronostico", label: "Pronóstico", icon: "calendar-outline", active: "calendar" },
  {
    name: "recordatorios",
    label: "Recordatorios",
    icon: "notifications-outline",
    active: "notifications",
  },
] as const;

type TabBarProps = {
  state: {
    index: number;
    routes: ReadonlyArray<{ key: string; name: string }>;
  };
  navigateToTab: (routeKey: string) => void;
};

export function BrumaTabBar({ state, navigateToTab }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const width = useSharedValue(0);
  const offset = useSharedValue(0);

  useEffect(() => {
    const next = state.index * width.value;
    offset.value = reduce ? next : withSpring(next, { damping: 22, stiffness: 280, mass: 0.7 });
  }, [offset, reduce, state.index, width]);

  const pillStyle = useAnimatedStyle(() => ({
    width: width.value,
    transform: [{ translateX: offset.value }],
  }));

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, space.sm) }]}>
      <View
        style={styles.row}
        onLayout={(event) => {
          const cell = event.nativeEvent.layout.width / tabs.length;
          width.value = cell;
          offset.value = state.index * cell;
        }}
      >
        <Animated.View pointerEvents="none" style={[styles.pill, pillStyle]} />
        {state.routes.map((route, index) => {
          const meta = tabs.find((tab) => tab.name === route.name) ?? tabs[0];
          const focused = state.index === index;
          return (
            <TabButton
              key={route.key}
              label={meta.label}
              icon={focused ? meta.active : meta.icon}
              focused={focused}
              onPress={() => {
                if (!focused) navigateToTab(route.key);
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabButton({
  label,
  icon,
  focused,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  onPress: () => void;
}) {
  const reduce = useReducedMotion();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.tab, animatedStyle]}>
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={label}
        onPress={onPress}
        onPressIn={() => {
          if (!reduce) scale.value = withTiming(0.97, { duration: 120 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 150 });
        }}
        style={styles.tabPress}
      >
        <Ionicons name={icon} size={20} color={focused ? colors.onInk : colors.muted} />
        <Text style={[styles.label, focused ? styles.labelOn : styles.labelOff]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: space.sm,
    paddingHorizontal: space.page,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  pill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
  },
  tab: {
    flex: 1,
  },
  tabPress: {
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
  },
  label: {
    ...type.labelSm,
    fontFamily: font.medium,
  },
  labelOn: {
    color: colors.onInk,
  },
  labelOff: {
    color: colors.muted,
  },
});
