import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { Shimmer } from "@/components/ui/molecules/Shimmer/Shimmer";
import { Alert } from "@/components/ui/primitives/alert";
import { Button } from "@/components/ui/base/button";
import { colors, font, radius, space, type } from "@/lib/theme";
import { useWeather } from "@/lib/weather/context";
import type { Sky } from "@/lib/weather/types";

const skyIcon: Record<Sky, keyof typeof Ionicons.glyphMap> = {
  clear: "sunny",
  partly: "partly-sunny",
  rain: "rainy",
  cloud: "cloud",
  night: "moon",
  twilight: "partly-sunny-outline",
};

export function useEnter(index: number) {
  const reduce = useReducedMotion();
  if (reduce) return FadeIn.duration(140);
  return FadeInDown.delay(Math.min(index, 8) * 42)
    .duration(220)
    .easing(Easing.bezier(0.2, 0, 0, 1));
}

export function Enter({
  index,
  children,
  style,
}: {
  index: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const entering = useEnter(index);
  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}

export function PressableScale({
  children,
  onPress,
  accessibilityLabel,
  style,
}: {
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
}) {
  const reduce = useReducedMotion();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        onPressIn={() => {
          if (!reduce) scale.value = withTiming(0.97, { duration: 120 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 160 });
        }}
        style={style}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export function WeatherGlyph({
  sky,
  size = 28,
  color = colors.ink,
  still = false,
}: {
  sky: Sky;
  size?: number;
  color?: string;
  still?: boolean;
}) {
  const reduce = useReducedMotion();
  const drift = useSharedValue(0);

  useEffect(() => {
    if (reduce || still) {
      drift.value = 0;
      return;
    }
    drift.value = withRepeat(
      withTiming(1, {
        duration: sky === "rain" ? 900 : 2800,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, [drift, reduce, sky, still]);

  const animatedStyle = useAnimatedStyle(() => {
    if (still || reduce) return { opacity: 1 };
    if (sky === "rain") {
      return {
        opacity: 0.72 + drift.value * 0.28,
        transform: [{ translateY: drift.value * 5 }],
      };
    }
    if (sky === "cloud") {
      return { transform: [{ translateX: (drift.value - 0.5) * 4 }] };
    }
    return {
      opacity: 0.86 + drift.value * 0.14,
      transform: [{ translateY: (drift.value - 0.5) * 3 }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={skyIcon[sky]} size={size} color={color} />
    </Animated.View>
  );
}

export function ScreenHeader({ observedAt }: { observedAt?: string }) {
  const router = useRouter();
  const { cityLabel } = useWeather();

  return (
    <View style={styles.header}>
      <View style={styles.headerCopy}>
        <Ionicons name="location-sharp" size={20} color={colors.ink} />
        <View>
          <Text style={styles.headerTitle}>{cityLabel}</Text>
          <Text style={styles.headerMeta}>Bruma · {observedAt ?? "—"}</Text>
        </View>
      </View>
      <PressableScale
        accessibilityLabel="Cambiar zona"
        onPress={() => router.push("/ciudad")}
        style={styles.iconButton}
      >
        <Ionicons name="search" size={20} color={colors.ink} />
      </PressableScale>
    </View>
  );
}

export function ConditionText({ text }: { text: string }) {
  return <Text style={styles.condition}>{text}</Text>;
}

export function Horizon({ sky }: { sky: Sky }) {
  return (
    <View style={styles.horizon}>
      <View style={styles.horizonLine} />
      <View style={styles.horizonGlyph}>
        <WeatherGlyph sky={sky} size={36} />
      </View>
    </View>
  );
}

export function LoadingState() {
  const reduce = useReducedMotion();
  const bars = [168, 96, 220, 140];
  return (
    <View style={styles.stack} accessibilityLabel="Cargando el tiempo">
      <Shimmer
        isLoading
        preset="neutral"
        variant={reduce ? "pulse" : "shimmer"}
        duration={reduce ? 1 : 1100}
        style={styles.heroSkeleton}
      />
      <View style={styles.metricSkeleton}>
        {bars.map((width) => (
          <Shimmer
            key={width}
            isLoading
            preset="neutral"
            variant={reduce ? "pulse" : "shimmer"}
            duration={reduce ? 1 : 1100}
            style={[styles.bar, { width }]}
          />
        ))}
      </View>
    </View>
  );
}

export function ErrorState({
  message,
  onRetry,
  width,
}: {
  message: string;
  onRetry: () => void;
  width: number;
}) {
  return (
    <View style={styles.stack}>
      <Alert variant="destructive" theme="light">
        <Alert.Icon />
        <Alert.Content>
          <Alert.Title style={styles.alertTitle}>Sin lectura</Alert.Title>
          <Alert.Description style={styles.alertBody}>{message}</Alert.Description>
        </Alert.Content>
      </Alert>
      <Button
        accessibilityLabel="Reintentar"
        onPress={onRetry}
        width={width}
        height={48}
        backgroundColor={colors.ink}
        loadingBackgroundColor={colors.inkSoft}
        borderRadius={radius.pill}
        animationDuration={160}
      >
        <Button.Content>
          <Button.Label color={colors.onInk} size={14} style={styles.buttonLabel}>
            Reintentar
          </Button.Label>
        </Button.Content>
      </Button>
    </View>
  );
}

export function EmptyNote({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: space.page,
    paddingVertical: space.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.paper,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.md,
  },
  headerCopy: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    flex: 1,
  },
  headerTitle: {
    ...type.title,
    color: colors.ink,
  },
  headerMeta: {
    ...type.labelSm,
    color: colors.muted,
    fontVariant: ["tabular-nums"],
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.paper,
  },
  condition: {
    ...type.title,
    color: colors.ink,
    textAlign: "right",
  },
  conditionSlot: {
    alignSelf: "flex-end",
    maxWidth: 180,
  },
  horizon: {
    height: 148,
    backgroundColor: colors.fillLow,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    justifyContent: "flex-end",
  },
  horizonLine: {
    height: 1,
    backgroundColor: colors.ink,
    marginHorizontal: space.lg,
    marginBottom: 36,
  },
  horizonGlyph: {
    position: "absolute",
    right: space.lg,
    top: 28,
  },
  stack: {
    gap: space.md,
  },
  heroSkeleton: {
    height: 220,
    borderRadius: radius.lg,
    backgroundColor: colors.fill,
  },
  metricSkeleton: {
    gap: space.sm,
  },
  bar: {
    height: 18,
    borderRadius: radius.md,
    backgroundColor: colors.fill,
  },
  alertTitle: {
    fontFamily: font.semibold,
  },
  alertBody: {
    fontFamily: font.regular,
  },
  buttonLabel: {
    fontFamily: font.semibold,
  },
  empty: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.paper,
    padding: space.md,
    gap: space.xs,
  },
  emptyTitle: {
    ...type.title,
    color: colors.ink,
  },
  emptyBody: {
    ...type.body,
    color: colors.muted,
  },
});
