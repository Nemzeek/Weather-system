export type Sky =
  | "clear"
  | "partly"
  | "rain"
  | "cloud"
  | "night"
  | "twilight";

export type CityId = "madrid" | "bilbao" | "valencia" | "tabernas";

export type City = {
  id: CityId;
  name: string;
  note: string;
};

export type HourPoint = {
  time: string;
  temp: number;
  rain: number;
  sky: Sky;
};

export type DayForecast = {
  id: string;
  label: string;
  detail: string;
  sky: Sky;
  min: number;
  max: number;
  rain: number;
};

export type WeatherHeadline = {
  title: string;
  rain: number;
  body: string;
};

export type WeatherReport = {
  city: City;
  observedAt: string;
  temperature: number;
  condition: string;
  sky: Sky;
  feelsLike: number;
  high: number;
  low: number;
  windKmh: number;
  windLabel: string;
  humidity: number;
  dewPoint: number;
  uv: number;
  uvLabel: string;
  uvNote: string;
  rainToday: number;
  rainNote: string;
  daylightLabel: string;
  daylightProgress: number;
  sunrise: string;
  sunset: string;
  hours: HourPoint[];
  days: DayForecast[];
  headline: WeatherHeadline | null;
};

export type Reminder = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

export type LoadStatus = "loading" | "error" | "ready";
