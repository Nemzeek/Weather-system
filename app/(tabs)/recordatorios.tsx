import { useRef, useState, type ComponentRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyNote, Enter, ScreenHeader } from "@/components/bruma/ui";
import { AnimatedChip } from "@/components/ui/molecules/animated-chip";
import { Button } from "@/components/ui/base/button";
import SegmentedControl from "@/components/ui/organisms/segmented-control";
import { Switch } from "@/components/ui/primitives/switch";
import { colors, font, radius, space, type } from "@/lib/theme";
import { useWeather } from "@/lib/weather/context";

const kinds = [
  {
    title: "Puesta de sol · 18:14",
    detail: "Cuando se esconde el sol (18:14)",
    short: "Atardecer",
  },
  {
    title: "Lluvia probable · ≥ 60%",
    detail: "Cuando es más propenso a que llueva",
    short: "Lluvia",
  },
  {
    title: "Amanecer · 08:12",
    detail: "Hora de amanecer del siguiente día (08:12)",
    short: "Amanecer",
  },
] as const;

const leads = [
  { id: "15", mark: "15", label: "min antes", sentence: "15 min antes" },
  { id: "30", mark: "30", label: "min antes", sentence: "30 min antes" },
  { id: "0", mark: "0", label: "exacta", sentence: "A la hora exacta" },
] as const;

export default function RecordatoriosScreen() {
  const { report, reminders, toggleReminder, removeReminder, addReminder } = useWeather();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const contentWidth = Math.max(160, width - space.page * 2);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const formY = useRef(0);
  const [kind, setKind] = useState(0);
  const [lead, setLead] = useState<(typeof leads)[number]["id"]>("15");
  const [saving, setSaving] = useState(false);

  const selectedLead = leads.find((item) => item.id === lead) ?? leads[0];

  async function save() {
    if (saving) return;
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 280));
    addReminder({
      title: kinds[kind].title,
      description: `Aviso programado: ${selectedLead.sentence}.`,
    });
    setSaving(false);
    scroll.current?.scrollTo({ y: 0, animated: true });
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader observedAt={report?.observedAt} />
      <ScrollView
        ref={scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 108 }]}
      >
        <Enter index={0}>
          <View style={styles.intro}>
            <Text style={styles.headline}>Recordatorios</Text>
            <Text style={styles.lede}>
              Alertas precisas sobre la puesta de sol, lluvia probable y el amanecer de mañana.
            </Text>
          </View>
        </Enter>

        <Enter index={1}>
          <View style={styles.next}>
            <View style={styles.nextCopy}>
              <Text style={styles.kicker}>Próximo evento</Text>
              <Text style={styles.cardTitle}>Atardecer · {report?.sunset ?? "18:14"}</Text>
            </View>
            <Button
              accessibilityLabel="Nuevo recordatorio"
              onPress={() => scroll.current?.scrollTo({ y: formY.current, animated: true })}
              width={112}
              height={40}
              backgroundColor={colors.ink}
              loadingBackgroundColor={colors.inkSoft}
              borderRadius={radius.pill}
              animationDuration={160}
            >
              <Button.Content>
                <Button.Label color={colors.onInk} size={14} style={styles.buttonLabel}>
                  Nuevo
                </Button.Label>
              </Button.Content>
            </Button>
          </View>
        </Enter>

        <View style={styles.list} accessibilityLabel="Avisos configurados">
          {reminders.length === 0 ? (
            <EmptyNote
              title="Ningún aviso"
              body="Añade un recordatorio de sol o de lluvia."
            />
          ) : (
            reminders.map((reminder, index) => (
              <Enter key={reminder.id} index={index + 2}>
                <View style={styles.reminder}>
                  <Switch
                    checked={reminder.enabled}
                    onCheckedChange={() => toggleReminder(reminder.id)}
                    theme="light"
                    trackColor={colors.ink}
                    thumbColor={colors.onInk}
                    size="sm"
                  >
                    <Switch.Content>
                      <Switch.Label style={styles.switchLabel}>{reminder.title}</Switch.Label>
                      <Switch.Description style={styles.switchBody}>
                        {reminder.description}
                      </Switch.Description>
                    </Switch.Content>
                    <Switch.Track />
                  </Switch>
                  <Text
                    accessibilityRole="button"
                    onPress={() => removeReminder(reminder.id)}
                    style={styles.remove}
                  >
                    Quitar
                  </Text>
                </View>
              </Enter>
            ))
          )}
        </View>

        <View
          style={styles.form}
          onLayout={(event) => {
            formY.current = event.nativeEvent.layout.y;
          }}
        >
          <Text style={styles.cardTitle}>Añadir recordatorio</Text>
          <View style={styles.field}>
            <Text style={styles.kicker}>Tipo de aviso</Text>
            <Text style={styles.fieldHelp}>{kinds[kind].detail}</Text>
            <SegmentedControl
              currentIndex={kind}
              onChange={setKind}
              preset="light"
              width={contentWidth - space.md * 2}
              borderRadius={radius.pill}
              paddingVertical={10}
              disableScaleEffect
              segmentedControlBackgroundColor={colors.fill}
              activeSegmentBackgroundColor={colors.paper}
              dividerColor={colors.line}
            >
              {kinds.map((item) => (
                <Text key={item.short} style={styles.segment}>
                  {item.short}
                </Text>
              ))}
            </SegmentedControl>
          </View>

          <View style={styles.field}>
            <Text style={styles.kicker}>Antelación</Text>
            <AnimatedChip
              value={lead}
              onValueChange={(value) => setLead(String(value) as (typeof leads)[number]["id"])}
              gap={8}
              haptics
              reserveWidth={false}
              springConfig={{ damping: 22, stiffness: 280, mass: 0.7 }}
            >
              {leads.map((item) => (
                <AnimatedChip.Item
                  key={item.id}
                  value={item.id}
                  activeColor={colors.ink}
                  inactiveColor={colors.fillLow}
                >
                  <AnimatedChip.Icon>
                    {(state) => (
                      <Text style={[styles.chipMark, state.selected && styles.chipMarkOn]}>
                        {item.mark}
                      </Text>
                    )}
                  </AnimatedChip.Icon>
                  <AnimatedChip.Label color={colors.onInk}>{item.label}</AnimatedChip.Label>
                </AnimatedChip.Item>
              ))}
            </AnimatedChip>
          </View>

          <Button
            accessibilityLabel="Guardar recordatorio"
            onPress={save}
            isLoading={saving}
            width={contentWidth - space.md * 2}
            height={48}
            backgroundColor={colors.ink}
            loadingBackgroundColor={colors.inkSoft}
            borderRadius={radius.pill}
            animationDuration={160}
          >
            <Button.Content>
              <Button.Label color={colors.onInk} size={14} style={styles.buttonLabel}>
                Guardar recordatorio
              </Button.Label>
            </Button.Content>
            <Button.Loading>
              <Button.Indicator color={colors.onInk} />
              <Button.Label color={colors.onInk} size={14} style={styles.buttonLabel}>
                Guardando
              </Button.Label>
            </Button.Loading>
          </Button>
        </View>
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
  next: {
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: radius.lg,
    padding: space.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.sm,
  },
  nextCopy: {
    gap: space.xs,
    flex: 1,
  },
  kicker: {
    ...type.label,
    color: colors.muted,
  },
  cardTitle: {
    ...type.title,
    color: colors.ink,
  },
  buttonLabel: {
    fontFamily: font.semibold,
  },
  list: {
    gap: space.sm,
  },
  reminder: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: space.md,
    gap: space.sm,
    backgroundColor: colors.paper,
  },
  switchLabel: {
    fontFamily: font.semibold,
    fontSize: 16,
    color: colors.ink,
  },
  switchBody: {
    fontFamily: font.regular,
    color: colors.muted,
  },
  remove: {
    ...type.label,
    color: colors.muted,
    alignSelf: "flex-start",
  },
  form: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: space.md,
    gap: space.md,
    backgroundColor: colors.paper,
  },
  field: {
    gap: space.xs,
  },
  fieldHelp: {
    ...type.body,
    color: colors.muted,
  },
  segment: {
    ...type.label,
    color: colors.ink,
    fontFamily: font.semibold,
    textAlign: "center",
  },
  chipMark: {
    fontFamily: font.semibold,
    fontSize: 13,
    color: colors.ink,
  },
  chipMarkOn: {
    color: colors.onInk,
  },
});
