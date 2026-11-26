import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconTile } from "@/components/ui/primitives/icon-tile";
import { NumberFlow } from "@/components/ui/molecules/number-flow";
import { AnimatedProgressBar } from "@/components/ui/organisms/progress";
import {
  ConditionText,
  EmptyNote,
  Enter,
  ErrorState,
  Horizon,
  LoadingState,
  ScreenHeader,
  WeatherGlyph,
} from "@/components/bruma/ui";
import { colors, font, radius, space, type } from "@/lib/theme";
import { useWeather } from "@/lib/weather/context";
import { useReducedMotion } from "react-native-reanimated";

export default function ZonaActualScreen() {
  const { status, error, report, retry } = useWeather();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const reduce = useReducedMotion();
  const contentWidth = Math.max(160, width - space.page * 2);

  return (
    <View style={styles.screen}>
      <ScreenHeader observedAt={report?.observedAt} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 108 },
        ]}
      >
        {status === "loading" ? <LoadingState /> : null}
        {status === "error" ? (
          <ErrorState
            message={error ?? "No se pudo leer la zona."}
            onRetry={retry}
            width={contentWidth}
          />
        ) : null}
        {status === "ready" && report ? (
          <>
            <Enter index={0}>
              <View style={styles.hero}>
                <Horizon sky={report.sky} />
                <View style={styles.heroBody}>
                  <View style={styles.heroTop}>
                    <View style={styles.heroTemp}>
                      <Text style={styles.kicker}>Zona actual</Text>
                      <View style={styles.tempRow}>
                        {reduce ? (
                          <Text style={styles.tempFallback}>{report.temperature}</Text>
                        ) : (
                          <NumberFlow
                            value={report.temperature}
                            fontSize={32}
                            color={colors.ink}
                            fontWeight="700"
                            fontFamily={font.bold}
                          />
                        )}
                        <Text style={styles.tempUnit}>°C</Text>
                      </View>
                    </View>
                    <View style={styles.heroSky}>
                      <WeatherGlyph sky={report.sky} size={28} />
                      <ConditionText text={report.condition} />
                    </View>
                  </View>
                  <View style={styles.heroFoot}>
                    <Text style={styles.muted}>Sensación térmica {report.feelsLike}°</Text>
                    <Text style={styles.range}>
                      Máx {report.high}° · Mín {report.low}°
                    </Text>
                  </View>
                </View>
              </View>
            </Enter>

            <View style={styles.metrics}>
              <Metric
                index={1}
                width={(contentWidth - space.sm) / 2}
                label="Viento"
                value={`${report.windKmh} km/h`}
                note={report.windLabel}
                icon="flag-outline"
              />
              <Metric
                index={2}
                width={(contentWidth - space.sm) / 2}
                label="Humedad"
                value={`${report.humidity}%`}
                note={`Rocío ${report.dewPoint}°`}
                icon="water-outline"
              />
              <Metric
                index={3}
                width={(contentWidth - space.sm) / 2}
                label="Índice UV"
                value={`${report.uv} · ${report.uvLabel}`}
                note={report.uvNote}
                icon="sunny-outline"
              />
              <Metric
                index={4}
                width={(contentWidth - space.sm) / 2}
                label="Lluvia hoy"
                value={`${report.rainToday}%`}
                note={report.rainNote}
                icon="rainy-outline"
              />
            </View>

            <Enter index={5}>
              <View style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={styles.cardTitle}>Luz solar</Text>
                  <Text style={styles.label}>{report.daylightLabel}</Text>
                </View>
                <AnimatedProgressBar
                  progress={report.daylightProgress}
                  animationDuration={reduce ? 1 : 420}
                  width={contentWidth - space.md * 2}
                  height={8}
                  borderRadius={radius.pill}
                  progressColor={colors.ink}
                  trackColor={colors.fill}
                  containerStyle={styles.progress}
                />
                <View style={styles.rowBetween}>
                  <View style={styles.inline}>
                    <Ionicons name="sunny-outline" size={18} color={colors.ink} />
                    <Text style={styles.muted}>Amanecer {report.sunrise}</Text>
                  </View>
                  <View style={styles.inline}>
                    <Ionicons name="moon-outline" size={18} color={colors.ink} />
                    <Text style={styles.muted}>Atardecer {report.sunset}</Text>
                  </View>
                </View>
              </View>
            </Enter>

            <Enter index={6}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Próximas horas</Text>
                {report.hours.length === 0 ? (
                  <EmptyNote
                    title="Sin horas publicadas"
                    body="Esta zona no tiene una serie horaria todavía."
                  />
                ) : (
                  <View style={styles.hours}>
                    {report.hours.map((hour) => (
                      <View key={hour.time} style={styles.hour}>
                        <Text style={styles.hourTime}>{hour.time}</Text>
                        <WeatherGlyph sky={hour.sky} size={22} still />
                        <Text style={styles.hourTemp}>{hour.temp}°</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </Enter>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

function Metric({
  index,
  width,
  label,
  value,
  note,
  icon,
}: {
  index: number;
  width: number;
  label: string;
  value: string;
  note: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Enter index={index} style={[styles.metric, { width }]}>
      <View style={styles.metricCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>{label}</Text>
          <IconTile
            size={32}
            cornerRadius={10}
            gloss={false}
            colors={["#F9F9F9", "#E8E8E8"]}
            contentColor={colors.ink}
          >
            <IconTile.Icon>
              <Ionicons name={icon} size={16} color={colors.ink} />
            </IconTile.Icon>
          </IconTile>
        </View>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.note}>{note}</Text>
      </View>
    </Enter>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    padding: space.page,
    gap: space.md,
  },
  hero: {
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.paper,
  },
  heroBody: {
    padding: space.md,
    gap: space.md,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: space.md,
  },
  heroTemp: {
    gap: space.xs,
    flexShrink: 1,
  },
  heroSky: {
    alignItems: "flex-end",
    gap: space.xs,
    flexShrink: 1,
  },
  kicker: {
    ...type.label,
    color: colors.muted,
  },
  tempRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tempFallback: {
    ...type.display,
    color: colors.ink,
    fontVariant: ["tabular-nums"],
  },
  tempUnit: {
    ...type.display,
    color: colors.ink,
  },
  heroFoot: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: space.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: space.sm,
  },
  muted: {
    ...type.body,
    color: colors.muted,
    fontVariant: ["tabular-nums"],
  },
  range: {
    ...type.label,
    color: colors.ink,
    fontFamily: font.semibold,
    fontVariant: ["tabular-nums"],
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  metric: {
    flexGrow: 1,
  },
  metricCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: space.md,
    gap: space.sm,
    backgroundColor: colors.paper,
    minHeight: 132,
  },
  metricValue: {
    ...type.titleLg,
    color: colors.ink,
    fontVariant: ["tabular-nums"],
  },
  note: {
    ...type.labelSm,
    color: colors.muted,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: space.md,
    gap: space.sm,
    backgroundColor: colors.paper,
  },
  cardTitle: {
    ...type.title,
    color: colors.ink,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.sm,
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
  },
  label: {
    ...type.label,
    color: colors.muted,
  },
  progress: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
  },
  hours: {
    flexDirection: "row",
    gap: space.sm,
  },
  hour: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.fillLow,
    padding: space.sm,
    alignItems: "center",
    gap: space.xs,
  },
  hourTime: {
    ...type.labelSm,
    color: colors.muted,
    fontVariant: ["tabular-nums"],
  },
  hourTemp: {
    ...type.title,
    color: colors.ink,
    fontVariant: ["tabular-nums"],
  },
});
