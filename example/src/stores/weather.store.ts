import { createStore } from "../../../es";

export type WeatherStore = {
  weather: string;
  temperature: number;
};

export const weatherStore = createStore<WeatherStore>({
  weather: "sunny",
  temperature: 28,
});

export function useWeatherStore() {
  const [{ weather, temperature }, updateStore] = weatherStore();

  const updateWeather = (weather: Partial<WeatherStore>) => {
    updateStore((store) => {
      return {
        ...store,
        ...weather,
      };
    });
  };

  return {
    weather,
    temperature,
    updateWeather,
  };
}
