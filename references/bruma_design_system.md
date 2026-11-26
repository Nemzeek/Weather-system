---
name: "Bruma"
description: "Minimalist monochrome weather app design system with crisp bordered cards, #000000 and #FFFFFF polarity, and Bricolage Grotesque typography."
---

## Overview

Bruma is a minimalist, editorial weather application for mobile devices. Built around stark monochrome clarity (`#000000` and `#FFFFFF`), crisp bordered cards, and expressive **Bricolage Grotesque** typography, it turns daily meteorological data—current conditions, multi-day forecasts, and solar/rain reminders—into a calm, high-contrast reading experience free of visual noise.

## Colors

The palette is anchored in pure black (`#000000`) and pure white (`#FFFFFF`), supported by neutral tonal steps for subtle card fills, hairline borders, and secondary metadata. Semantic status colors are reserved strictly for weather alerts and reminder states.

- **Primary (`#000000` in light):** High-contrast ink, active navigation pills, primary action buttons, and focal temperature figures.
- **Surface (`#FFFFFF` in light):** Clean paper canvas for screens and bordered cards.
- **Outline Variant (`#E2E2E2` in light):** Crisp `1px` borders that define card boundaries without heavy shadows.

```yaml
colors:
  accent: "#000000"
  light:
    primary: "#000000"
    on-primary: "#FFFFFF"
    primary-container: "#1B1B1B"
    on-primary-container: "#E2E2E2"
    secondary: "#474747"
    on-secondary: "#FFFFFF"
    secondary-container: "#F1F1F1"
    on-secondary-container: "#1B1B1B"
    tertiary: "#303030"
    on-tertiary: "#FFFFFF"
    tertiary-container: "#E2E2E2"
    on-tertiary-container: "#1B1B1B"
    error: "#BA1A1A"
    on-error: "#FFFFFF"
    error-container: "#FFDAD6"
    on-error-container: "#93000A"
    background: "#FFFFFF"
    on-background: "#000000"
    surface: "#FFFFFF"
    surface-dim: "#F1F1F1"
    surface-bright: "#FFFFFF"
    surface-container-lowest: "#FFFFFF"
    surface-container-low: "#F9F9F9"
    surface-container: "#F1F1F1"
    surface-container-high: "#E8E8E8"
    surface-container-highest: "#E2E2E2"
    on-surface: "#000000"
    surface-variant: "#F1F1F1"
    on-surface-variant: "#474747"
    outline: "#777777"
    outline-variant: "#E2E2E2"
    inverse-surface: "#000000"
    inverse-on-surface: "#FFFFFF"
    inverse-primary: "#E2E2E2"
  dark:
    primary: "#FFFFFF"
    on-primary: "#000000"
    primary-container: "#E2E2E2"
    on-primary-container: "#1B1B1B"
    secondary: "#C6C6C6"
    on-secondary: "#1B1B1B"
    secondary-container: "#303030"
    on-secondary-container: "#E2E2E2"
    tertiary: "#ABABAB"
    on-tertiary: "#1B1B1B"
    tertiary-container: "#303030"
    on-tertiary-container: "#F1F1F1"
    error: "#FFB4AB"
    on-error: "#690005"
    error-container: "#93000A"
    on-error-container: "#FFDAD6"
    background: "#131313"
    on-background: "#FFFFFF"
    surface: "#131313"
    surface-dim: "#0E0E0E"
    surface-bright: "#2A2A2A"
    surface-container-lowest: "#0E0E0E"
    surface-container-low: "#1B1B1B"
    surface-container: "#1F1F1F"
    surface-container-high: "#2A2A2A"
    surface-container-highest: "#353535"
    on-surface: "#FFFFFF"
    surface-variant: "#303030"
    on-surface-variant: "#C6C6C6"
    outline: "#919191"
    outline-variant: "#303030"
    inverse-surface: "#FFFFFF"
    inverse-on-surface: "#000000"
    inverse-primary: "#474747"
```

## Typography

**Bricolage Grotesque** drives the entire typographic hierarchy, from oversized meteorological readouts to compact hourly timestamps and reminder labels. Its optical sizing and subtle calligraphic warmth give a stark `#000000` / `#FFFFFF` interface an editorial, human character. Numeric metrics and timestamps use `tabular-nums` for clean vertical alignment.

```yaml
typography:
  display-lg:
    fontFamily: "Bricolage Grotesque"
    fontSize: 56px
    fontWeight: 700
    lineHeight: 60px
    letterSpacing: -1.5px
  display-lg-mobile:
    fontFamily: "Bricolage Grotesque"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 36px
    letterSpacing: -0.75px
  headline-lg:
    fontFamily: "Bricolage Grotesque"
    fontSize: 36px
    fontWeight: 600
    lineHeight: 42px
    letterSpacing: -0.75px
  headline-lg-mobile:
    fontFamily: "Bricolage Grotesque"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 34px
    letterSpacing: -0.5px
  headline-md:
    fontFamily: "Bricolage Grotesque"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 30px
    letterSpacing: -0.25px
  title-lg:
    fontFamily: "Bricolage Grotesque"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 26px
    letterSpacing: -0.2px
  title-md:
    fontFamily: "Bricolage Grotesque"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 22px
    letterSpacing: 0px
  body-lg:
    fontFamily: "Bricolage Grotesque"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0px
  body-md:
    fontFamily: "Bricolage Grotesque"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  label-lg:
    fontFamily: "Bricolage Grotesque"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 18px
    letterSpacing: 0.1px
  label-md:
    fontFamily: "Bricolage Grotesque"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0.2px
  label-sm:
    fontFamily: "Bricolage Grotesque"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 14px
    letterSpacing: 0.3px
```

## Layout & Spacing

Mobile-first single-column **Fluid Grid** (`390px` target width) with `20px` horizontal page margins and a strict `4px` / `8px` spacing rhythm. Cards are separated by `12px`–`16px` gaps, with `16px` or `20px` internal padding. A persistent fixed bottom navigation bar (`downbar`) anchors the three core views with generous bottom clearance on the scrollable main content.

```yaml
spacing:
  gutter-xs: 4px
  gutter-sm: 8px
  gutter-md: 16px
  gutter-lg: 24px
  gutter-xl: 32px
  section: 40px
  page-margin: 20px
```

## Elevation & Depth

Bruma uses a flat, **bordered-card** elevation model rather than drop shadows. Primary cards sit on `surface` (`#FFFFFF`) framed by `1px` crisp borders (`outline-variant` `#E2E2E2`, or `primary` `#000000` for active/selected states). Secondary metric tiles and nested chips use `surface-container-low` (`#F9F9F9`) or `surface-container` (`#F1F1F1`) to create quiet tonal separation.

## Shapes

Clean architectural geometry with generous corner radii (`16px` for primary weather cards, `12px` for compact metric tiles and inputs, and `9999px` pill shapes for buttons, status chips, and the bottom navigation active indicator).

```yaml
rounded:
  sm: 4px
  DEFAULT: 8px
  md: 12px
  lg: 16px
  xl: 24px
  full: 9999px
```

## Motion & Micro-interaction

Motion is crisp and restrained. Toggle switches, tab indicators, and reminder cards respond within `120ms` using `ease-out`, while view transitions settle smoothly in `220ms`. Only `transform`, `opacity`, and color properties animate.

```yaml
motion:
  state-change:
    duration: 120ms
    delay: 0ms
    timingFunction: ease-out
  surface-enter:
    duration: 220ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
  surface-exit:
    duration: 150ms
    delay: 0ms
    timingFunction: cubic-bezier(0.3, 0, 1, 1)
```

## Voice & Content Strategy

- **Language & Tone:** Clear, concise Spanish. Calm, editorial, and direct ("Cielo despejado", "Probabilidad de lluvia", "Atardecer a las 18:14").
- **Capitalisation:** Sentence case across all headings, card titles, and navigation labels ("Zona actual", "Pronóstico", "Recordatorios").
- **Formats:** 24-hour clock (`07:54`, `18:14`), Celsius (`18°`, `12° / 21°`), percentages (`65%`), and wind speed in `km/h`.
- **Action Labels:** Specific verb phrases ("Añadir recordatorio", "Guardar aviso", "Cambiar zona").

## Components

Component implementations live as individual HTML sticker sheet files in
`components/`. Each file contains the canonical, styled HTML components with
`<!-- COMPONENT: name -->` comment markers. Read each file before use.

- **Button** → `@components/button.html` — `button-primary`, `button-icon`, `button-with-icon`
- **Card** → `@components/card.html` — `card-elevated`, `card-action`, `card-interactive`, `card-interactive-2`
- **Toggle** → `@components/toggle.html` — `toggle-standard`, `toggle-label`, `toggle-description`
- **Typography** → `@components/typography.html` — `typography-display`, `typography-body`, `typography-label`
