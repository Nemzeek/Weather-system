import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { reports } from "@/lib/weather/fixtures";
import { fetchWeather, fetchWeatherByName } from "@/lib/weather/service";
import type { CityId, LoadStatus, Reminder, WeatherReport } from "@/lib/weather/types";

type Request =
  | { kind: "city"; id: CityId }
  | { kind: "name"; name: string };

type WeatherContextValue = {
  status: LoadStatus;
  error: string | null;
  report: WeatherReport | null;
  cityLabel: string;
  reminders: Reminder[];
  selectCity: (id: CityId) => void;
  consultName: (name: string) => void;
  retry: () => void;
  toggleReminder: (id: string) => void;
  removeReminder: (id: string) => void;
  addReminder: (input: { title: string; description: string }) => void;
};

const WeatherContext = createContext<WeatherContextValue | null>(null);

const initialReminders: Reminder[] = [
  {
    id: "sunset",
    title: "Puesta de sol · 18:14",
    description: "Aviso 20 min antes.",
    enabled: true,
  },
  {
    id: "rain",
    title: "Lluvia probable · ≥ 60%",
    description: "Aviso si supera el 60%.",
    enabled: true,
  },
  {
    id: "sunrise",
    title: "Amanecer · 08:12",
    description: "Aviso 15 min antes.",
    enabled: false,
  },
];

export function WeatherProvider({ children }: { children: ReactNode }) {
  const request = useRef<Request>({ kind: "city", id: "madrid" });
  const [status, setStatus] = useState<LoadStatus>("ready");
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<WeatherReport | null>(reports.madrid);
  const [cityLabel, setCityLabel] = useState(reports.madrid.city.name);
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [ticket, setTicket] = useState(0);

  useEffect(() => {
    let active = true;
    const current = request.current;

    const task =
      current.kind === "city"
        ? fetchWeather(current.id)
        : fetchWeatherByName(current.name);

    task
      .then((next) => {
        if (!active) return;
        setReport(next);
        setCityLabel(next.city.name);
        setError(null);
        setStatus("ready");
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setReport(null);
        setError(
          reason instanceof Error ? reason.message : "No se pudo leer la zona.",
        );
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [ticket]);

  const selectCity = useCallback((id: CityId) => {
    request.current = { kind: "city", id };
    setStatus("loading");
    setError(null);
    setTicket((value) => value + 1);
  }, []);

  const consultName = useCallback((name: string) => {
    request.current = { kind: "name", name };
    setCityLabel(name.trim());
    setStatus("loading");
    setError(null);
    setTicket((value) => value + 1);
  }, []);

  const retry = useCallback(() => {
    setStatus("loading");
    setError(null);
    setTicket((value) => value + 1);
  }, []);

  const toggleReminder = useCallback((id: string) => {
    setReminders((current) =>
      current.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    );
  }, []);

  const removeReminder = useCallback((id: string) => {
    setReminders((current) => current.filter((item) => item.id !== id));
  }, []);

  const addReminder = useCallback((input: { title: string; description: string }) => {
    setReminders((current) => [
      {
        id: `reminder-${Date.now()}`,
        title: input.title,
        description: input.description,
        enabled: true,
      },
      ...current,
    ]);
  }, []);

  const value = useMemo<WeatherContextValue>(
    () => ({
      status,
      error,
      report,
      cityLabel,
      reminders,
      selectCity,
      consultName,
      retry,
      toggleReminder,
      removeReminder,
      addReminder,
    }),
    [
      status,
      error,
      report,
      cityLabel,
      reminders,
      selectCity,
      consultName,
      retry,
      toggleReminder,
      removeReminder,
      addReminder,
    ],
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather() {
  const value = useContext(WeatherContext);
  if (!value) {
    throw new Error("useWeather debe usarse dentro de WeatherProvider.");
  }
  return value;
}
