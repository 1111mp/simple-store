import { useInfoStore } from "./stores/weather.store";

export const Temp: React.FC = () => {
  const { name, weather, temperature, updateAge } = useInfoStore();

  return (
    <div>
      Temp
      <br />
      name: {name}
      <br />
      weather: {weather}
      <br />
      temperature: {temperature} 摄氏度
      <br />
      <button
        onClick={() => {
          updateAge();
        }}
      >
        update age
      </button>
    </div>
  );
};
