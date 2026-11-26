# Bruma

Aplicación del tiempo en Expo (SDK 58), con Expo Router y TypeScript. La interfaz sigue el sistema Bruma: blanco, negro y Bricolage Grotesque.

## Arranque

```bash
npm start
```

- Android: `npm run android`
- Web: `npm run web`
- Comprobación de tipos: `npx tsc --noEmit`

Los diseños de origen están en `references/`. Los datos meteorológicos salen de un fixture en `lib/weather/service.ts`, con la misma forma que tendría una API real.
