import { cities, reports } from "@/lib/weather/fixtures";
import type { CityId, WeatherReport } from "@/lib/weather/types";

const WAIT_MS = 680;

function wait(ms = WAIT_MS) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Lectura de una zona. El cuerpo es un fixture con la forma de una API real:
 * sustituir esta función (Open-Meteo u otra) sin cambiar WeatherReport.
 */
export async function fetchWeather(cityId: CityId): Promise<WeatherReport> {
  await wait();
  return reports[cityId];
}

export async function fetchWeatherByName(name: string): Promise<WeatherReport> {
  await wait();
  const query = name.trim().toLocaleLowerCase("es");
  const hit = cities.find((city) => {
    const label = city.name.toLocaleLowerCase("es");
    const place = label.split(",")[0]?.trim() ?? label;
    return label.includes(query) || query.includes(place);
  });
  if (!hit) {
    throw new Error(`No hay observación para «${name.trim()}».`);
  }
  return reports[hit.id];
}
