# Cómo se armó Bruma

App de clima en React Native (Expo), hecha dentro de `D:\Proyectos\Weather`. El diseño original se conservó en `references/`. Las pantallas reales viven en `app/`.

## 1. Lo que ya había en la carpeta

Antes de crear la app solo estaban el sistema de diseño y tres HTML:

- `references/bruma_design_system.md`
- `references/zona_actual/code.html`
- `references/pron_stico/code.html`
- `references/recordatorios/code.html`

Esos archivos siguen ahí. No se borró el diseño.

## 2. React Native con Expo

La carpeta no estaba vacía, así que esos archivos se apartaron, se creó el proyecto en la raíz y después se devolvieron a `references/`.

Comando de creación (plantilla con pestañas, TypeScript y expo-router):

```bash
npx create-expo-app@latest . --template tabs
```

Quedó así:

- Expo SDK 58
- React Native 0.88
- TypeScript
- Entry: `expo-router/entry` (en `package.json`, campo `main`)
- Nombre de la app: Bruma (`app.json`)

Rutas:

| Ruta | Pantalla |
| --- | --- |
| `app/(tabs)/index.tsx` | Zona actual |
| `app/(tabs)/pronostico.tsx` | Pronóstico |
| `app/(tabs)/recordatorios.tsx` | Recordatorios |
| `app/ciudad.tsx` | Cambiar zona (modal) |

Para arrancar:

```bash
npm start
npm run android
npm run web
```

## 3. Dependencias de animación y gráficos

Reacticx en nativo usa Reanimated, gestos, Skia y alguna pieza de Expo. Se instalaron con el instalador de Expo para que las versiones coincidan con el SDK:

```bash
npx expo install react-native-reanimated react-native-gesture-handler react-native-worklets react-native-svg react-native-safe-area-context react-native-screens
npx expo install @shopify/react-native-skia expo-linear-gradient expo-blur expo-haptics expo-font
npx expo install @expo-google-fonts/bricolage-grotesque
```

La tipografía de Bruma es Bricolage Grotesque. El movimiento (entrada en cascada, spring de la barra, presión a escala 0.97, dígitos de la temperatura) va con `react-native-reanimated`, que es el equivalente en React Native de las animaciones tipo Motion.

## 4. Reacticx (componentes de diseño)

La librería es [reacticx.com](https://reacticx.com/). No es un paquete que se importe entero: el CLI copia el código del componente a `components/ui`.

Primero se inicializó la config del proyecto:

```bash
npx reacticx@latest init
```

Eso dejó `component.config.json` en la raíz:

- salida en `components/ui`
- estructura por categoría (`primitives`, `molecules`, `organisms`, `charts`, `base`)
- alias `@/components/ui`
- gestor `npm` e instalación automática de dependencias

Después se añadieron los componentes:

```bash
npx reacticx add number-flow icon-tile progress shimmer staggered-text line-chart segmented-control list switch animated-chip button search-bar alert
```

El CLI también trae piezas internas que esos componentes necesitan, por ejemplo `squircle-view` (lo usa `List`).

## 5. Qué componente quedó en cada pantalla

Sí se implementaron. No se quedaron solo en la carpeta.

**Zona actual** (`app/(tabs)/index.tsx`)

- `NumberFlow`: la temperatura (18, 14, 21…) anima los dígitos
- `IconTile`: el icono de viento, humedad, UV y lluvia
- `AnimatedProgressBar`: la barra de luz solar
- `Shimmer`: el esqueleto gris de carga (el que se vio pegado en la web antes del arreglo)

**Pronóstico** (`app/(tabs)/pronostico.tsx`)

- `LineChart`: la curva de horas o de lluvia
- `SegmentedControl`: el cambio entre temperatura y lluvia
- `List`: los seis días

**Recordatorios** (`app/(tabs)/recordatorios.tsx`)

- `Switch`: activar o pausar un aviso
- `AnimatedChip`: la antelación
- `SegmentedControl`: el tipo de aviso
- `Button`: guardar

**Cambiar zona** (`app/ciudad.tsx`)

- `SearchBar`: buscar ciudad
- `List`: resultados
- `Button`: consultar
- `Alert`: error si el nombre no existe (desde `components/bruma/ui.tsx`)

**Instalado, pero no montado en la pantalla de inicio**

- `StaggeredText` sí se añadió y al principio animaba el texto de la condición («Cielo despejado»). En la web revienta porque Skia todavía no tiene CanvasKit cuando ese componente pide una fuente. Se sustituyó por un `Text` normal. El archivo sigue en `components/ui/organisms/staggered-text/` por si se quiere volver a usar en un development build, donde Skia sí está listo.

La barra de abajo (`components/bruma/tab-bar.tsx`) no es un componente de Reacticx. Se hizo a medida, con la pastilla negra del diseño y un spring de Reanimated.

## 6. Datos

No hay API ni claves. `lib/weather/service.ts` devuelve un fixture con la forma de una respuesta real (Madrid, Bilbao, Valencia, Tabernas). Al abrir, Madrid ya está cargado para no quedarse en el esqueleto gris.
