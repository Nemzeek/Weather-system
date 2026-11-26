import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyNote, PressableScale } from "@/components/bruma/ui";
import { Button } from "@/components/ui/base/button";
import { SearchBar } from "@/components/ui/molecules/search-bar/SearchBar";
import { List } from "@/components/ui/primitives/list";
import { cities } from "@/lib/weather/fixtures";
import { colors, font, radius, space, type } from "@/lib/theme";
import { useWeather } from "@/lib/weather/context";

export default function CiudadScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const contentWidth = Math.max(160, width - space.page * 2);
  const { selectCity, consultName } = useWeather();
  const [query, setQuery] = useState("");

  const needle = query.trim().toLocaleLowerCase("es");
  const matches = cities.filter((city) => {
    if (!needle) return true;
    return city.name.toLocaleLowerCase("es").includes(needle);
  });

  return (
    <View style={[styles.screen, { paddingTop: insets.top + space.sm }]}>
      <View style={styles.top}>
        <View>
          <Text style={styles.kicker}>Cambiar zona</Text>
          <Text style={styles.title}>Dónde mirar</Text>
        </View>
        <PressableScale
          accessibilityLabel="Cerrar"
          onPress={() => router.back()}
          style={styles.close}
        >
          <Ionicons name="close" size={18} color={colors.ink} />
        </PressableScale>
      </View>

      <SearchBar
        placeholder="Buscar zona"
        tint={colors.ink}
        containerWidth={contentWidth}
        cancelButtonWidth={92}
        centerWhenUnfocused={false}
        onSearch={setQuery}
        onClear={() => setQuery("")}
        inputStyle={styles.input}
        style={styles.search}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space.lg }]}
      >
        {matches.length === 0 ? (
          <View style={styles.emptyWrap}>
            <EmptyNote
              title="Ninguna zona coincide"
              body="Prueba con Madrid, Bilbao o Valencia, o consulta el nombre escrito."
            />
            {query.trim().length > 0 ? (
              <Button
                accessibilityLabel="Consultar zona"
                onPress={() => {
                  consultName(query);
                  router.back();
                }}
                width={contentWidth}
                height={48}
                backgroundColor={colors.ink}
                loadingBackgroundColor={colors.inkSoft}
                borderRadius={radius.pill}
                animationDuration={160}
              >
                <Button.Content>
                  <Button.Label color={colors.onInk} size={14} style={styles.buttonLabel}>
                    Consultar «{query.trim()}»
                  </Button.Label>
                </Button.Content>
              </Button>
            ) : null}
          </View>
        ) : (
          <List theme="light">
            <List.Section>
              <List.Section.Content>
                {matches.map((city) => (
                  <List.Item
                    key={city.id}
                    onPress={() => {
                      selectCity(city.id);
                      router.back();
                    }}
                  >
                    <List.Item.Icon>
                      <Ionicons name="location-outline" size={18} color={colors.ink} />
                    </List.Item.Icon>
                    <List.Item.Content>
                      <List.Item.Title style={styles.rowTitle}>{city.name}</List.Item.Title>
                      <List.Item.Subtitle style={styles.rowSubtitle}>{city.note}</List.Item.Subtitle>
                    </List.Item.Content>
                    <List.Item.Chevron color={colors.ink} />
                  </List.Item>
                ))}
              </List.Section.Content>
            </List.Section>
          </List>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
    paddingHorizontal: space.page,
    gap: space.md,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.md,
  },
  kicker: {
    ...type.label,
    color: colors.muted,
  },
  title: {
    ...type.headline,
    fontSize: 28,
    color: colors.ink,
  },
  close: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    alignSelf: "stretch",
  },
  input: {
    color: colors.ink,
    fontFamily: font.regular,
    fontSize: 16,
  },
  content: {
    gap: space.md,
  },
  emptyWrap: {
    gap: space.md,
  },
  buttonLabel: {
    fontFamily: font.semibold,
  },
  rowTitle: {
    fontFamily: font.semibold,
  },
  rowSubtitle: {
    fontFamily: font.regular,
  },
});
