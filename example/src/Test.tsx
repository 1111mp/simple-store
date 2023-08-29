import { Component, ReactNode } from "react";

import { withStore } from "../../";
import { useWeatherStore } from "./stores/weather.store";

type Props = ReturnType<typeof useWeatherStore> & {};

class Test extends Component<Props> {
  render(): React.ReactNode {
    console.log("rerender from Test");
    const { weather, temperature, updateWeather, updateTemperature } =
      this.props;
    return (
      <div>
        Test
        <br />
        weather: {weather}
        <br />
        temperature: {temperature} 摄氏度
        <br />
        <button
          onClick={() => {
            updateWeather("hot");
          }}
        >
          update weather
        </button>
        <br />
        <button
          onClick={() => {
            updateTemperature(30);
          }}
        >
          update temperature
        </button>
      </div>
    );
  }
}

export default withStore(useWeatherStore, (weatherStore) => ({
  ...weatherStore,
}))(Test);
