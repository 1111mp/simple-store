import { userStore } from "./stores/user.store";
import { weatherStore } from "./stores/weather.store";

export const Info: React.FC = () => {
  const [{ name, age }, updateUserStore] = userStore();
  const [{ weather, temperature }, updateWeatherStore] = weatherStore();

  return (
    <div>
      Info
      <br />
      name: {name}
      <br />
      age: {age}
      <br />
      <button
        onClick={() => {
          updateUserStore({
            name: name + 1,
            age: age + 1,
          });
        }}
      >
        update
      </button>
      <br />
      weather: {weather}
      <br />
      temperature: {temperature} 摄氏度
      <br />
      <button
        onClick={() => {
          updateWeatherStore((store) => {
            return {
              ...store,
              weather: "cold",
              temperature: -10,
            };
          });
        }}
      >
        update weather
      </button>
    </div>
  );
};
