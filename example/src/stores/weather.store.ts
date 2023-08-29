import { createStore } from "../../../es";

import { useUserStore } from "./user.store";

export type WeatherStore = {
  weather: string;
  temperature: number;
};

export const weatherStore = createStore<WeatherStore>({
  weather: "sunny",
  temperature: 28,
});

export function useWeatherNameStore() {
  const [{ weather }, updateStore] = weatherStore((store) => [store.weather]);

  const updateWeather = (weather: string) => {
    updateStore((store) => {
      return {
        ...store,
        weather,
      };
    });
  };

  return {
    weather,
    updateWeather,
  };
}

export function useTempStore() {
  const [{ temperature }, updateStore] = weatherStore((store) => [
    store.temperature,
  ]);

  const updateTemperature = (temperature: number) => {
    updateStore((store) => {
      return {
        ...store,
        temperature,
      };
    });
  };

  return {
    temperature,
    updateTemperature,
  };
}

export function useWeatherStore() {
  const { weather, updateWeather } = useWeatherNameStore();
  const { temperature, updateTemperature } = useTempStore();

  return {
    weather,
    temperature,
    updateWeather,
    updateTemperature,
  };
}

export function useInfoStore() {
  const { name, updateAge } = useUserStore();

  const { weather } = useWeatherNameStore();
  const { temperature } = useTempStore();

  return {
    name,
    weather,
    temperature,
    updateAge,
  };
}
