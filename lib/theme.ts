export const colors = {
  ink: "#000000",
  paper: "#FFFFFF",
  onInk: "#FFFFFF",
  muted: "#474747",
  line: "#E2E2E2",
  lineStrong: "#777777",
  fill: "#F1F1F1",
  fillLow: "#F9F9F9",
  inkSoft: "#1B1B1B",
  danger: "#BA1A1A",
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  page: 20,
} as const;

export const radius = {
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const font = {
  regular: "BricolageGrotesque_400Regular",
  medium: "BricolageGrotesque_500Medium",
  semibold: "BricolageGrotesque_600SemiBold",
  bold: "BricolageGrotesque_700Bold",
} as const;

export const type = {
  display: {
    fontFamily: font.bold,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.75,
  },
  headline: {
    fontFamily: font.semibold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  title: {
    fontFamily: font.semibold,
    fontSize: 16,
    lineHeight: 22,
  },
  titleLg: {
    fontFamily: font.semibold,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: font.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontFamily: font.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  labelSm: {
    fontFamily: font.medium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.3,
  },
} as const;
