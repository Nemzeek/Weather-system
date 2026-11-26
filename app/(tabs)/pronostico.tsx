import { useState } from "react";
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyNote, Enter, ErrorState, Horizon, LoadingState, ScreenHeader, WeatherGlyph } from "@/components/bruma/ui";
import { LineChart } from "@/components/ui/charts/line-chart";
import SegmentedControl from "@/components/ui/organisms/segmented-control";
import { List } from "@/components/ui/primitives/list";
import { colors, font, radius, space, type } from "@/lib/theme";
import { useWeather } from "@/lib/weather/context";

export default function PronosticoScreen() {
  const { status, error, report, retry } = useWeather();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const reduce = useReducedMotion();
  const contentWidth = Math.max(160, width - space.page * 2);
  const [series, setSeries] = useState(0);

  const hours = report?.hours ?? [];
  const days = report?.days ?? [];
  const temperature = hours.map((point, index) => ({ x: index, y: point.temp }));
  const rain = hours.map((point, index) => ({ x: index, y: point.rain }));
  const data = series === 0 ? temperature : rain;
  const canChart = data.length >= 2;

  return (
    <View style={styles.screen}>
      <ScreenHeader observedAt={report?.observedAt} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 108 }]}>
        <Enter index={0}>
          <View style={styles.intro}>
            <Text style={styles.headline}>Pronóstico del clima</Text>
            <Text style={styles.lede}>
              Previsión extendida de temperatura y probabilidad de lluvia.
            </Text>
          </View>
        </Enter>

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
            {report.headline ? (
              <Enter index={1}>
                <View style={styles.feature}>
                  <Horizon sky={report.sky} />
                  <View style={styles.featureBody}>
                    <View style={styles.featureTop}>
                      <Text style={styles.cardTitle}>{report.headline.title}</Text>
                      <Text style={styles.pill}>{report.headline.rain}%</Text>
                    </View>
                    <Text style={styles.lede}>{report.headline.body}</Text>
                  </View>
                </View>
              </Enter>
            ) : (
              <EmptyNote
                title="Sin aviso destacado"
                body="No hay un frente descrito para esta zona."
              />
            )}

            <Enter index={2}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Próximas horas</Text>
                <SegmentedControl
                  currentIndex={series}
                  onChange={setSeries}
                  preset="light"
                  width={contentWidth - space.md * 2}
                  borderRadius={radius.pill}
                  paddingVertical={10}
                  disableScaleEffect
                  segmentedControlBackgroundColor={colors.fill}
                  activeSegmentBackgroundColor={colors.paper}
                  dividerColor={colors.line}
                >
                  <Text style={styles.segment}>Temperatura</Text>
                  <Text style={styles.segment}>Lluvia</Text>
                </SegmentedControl>
                {canChart ? (
                  <LineChart
                    data={data}
                    curve="natural"
                    animate={!reduce}
                    drawDuration={reduce ? 1 : 640}
                    minY={series === 1 ? 0 : undefined}
                    maxY={series === 1 ? 100 : undefined}
                    enablePan
                    style={styles.chart}
                  >
                    <LineChart.Grid count={3} color={colors.line} />
                    <LineChart.Area colors={[colors.ink, colors.paper]} opacity={0.16} />
                    <LineChart.Line color={colors.ink} thickness={2} />
                    <LineChart.Indicator color={colors.ink} pulsating={false} />
                    <LineChart.Cursor color={colors.ink} showCrosshair crosshairColor={colors.line} />
                    <LineChart.Tooltip
                      format={(point, index) => {
                        const hour = hours[index];
                        const suffix = series === 0 ? "°" : "%";
                        return hour ? `${hour.time} · ${Math.round(point.y)}${suffix}` : `${Math.round(point.y)}${suffix}`;
                      }}
                    />
                  </LineChart>
                ) : (
                  <EmptyNote
                    title="Sin serie horaria"
                    body="Hace falta más de una lectura para dibujar la curva."
                  />
                )}
              </View>
            </Enter>

            <Enter index={3}>
              {days.length === 0 ? (
                <EmptyNote
                  title="Sin pronóstico extendido"
                  body="Cuando la estación publique la serie, aparecerá aquí."
                />
              ) : (
                <List theme="light">
                  <List.Section>
                    <List.Section.Title style={styles.sectionTitle}>Seis días</List.Section.Title>
                    <List.Section.Content>
                      {days.map((day) => (
                        <List.Item key={day.id}>
                          <List.Item.Icon>
                            <WeatherGlyph sky={day.sky} size={20} still />
                          </List.Item.Icon>
                          <List.Item.Content>
                            <List.Item.Title style={styles.rowTitle}>{day.label}</List.Item.Title>
                            <List.Item.Subtitle style={styles.rowSubtitle}>{day.detail}</List.Item.Subtitle>
                          </List.Item.Content>
                          <List.Item.Value style={styles.rowValue}>
                            {day.min}° / {day.max}°
                          </List.Item.Value>
                        </List.Item>
                      ))}
                    </List.Section.Content>
                  </List.Section>
                </List>
              )}
            </Enter>
          </>
        ) : null}
      </ScrollView>
    </View>
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
  intro: {
    gap: space.xs,
  },
  headline: {
    ...type.headline,
    color: colors.ink,
  },
  lede: {
    ...type.body,
    color: colors.muted,
  },
  feature: {
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.paper,
  },
  featureBody: {
    padding: space.md,
    gap: space.xs,
  },
  featureTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.sm,
  },
  cardTitle: {
    ...type.title,
    color: colors.ink,
    flex: 1,
  },
  pill: {
    ...type.label,
    color: colors.ink,
    fontFamily: font.semibold,
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    fontVariant: ["tabular-nums"],
  },
  card: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: space.md,
    backgroundColor: colors.paper,
    gap: space.sm,
  },
  segment: {
    ...type.label,
    color: colors.ink,
    fontFamily: font.semibold,
    textAlign: "center",
  },
  chart: {
    height: 180,
  },
  sectionTitle: {
    textTransform: "none",
    letterSpacing: -0.2,
    fontSize: 16,
    fontFamily: font.semibold,
    color: colors.ink,
    paddingLeft: 0,
  },
  rowTitle: {
    fontFamily: font.semibold,
    fontSize: 16,
  },
  rowSubtitle: {
    fontFamily: font.medium,
    fontVariant: ["tabular-nums"],
  },
  rowValue: {
    fontFamily: font.semibold,
    fontVariant: ["tabular-nums"],
  },
});
