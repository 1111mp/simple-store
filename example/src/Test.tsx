import { Component, ReactNode } from "react";

import { withStore } from "../../";
import { useWeatherStore } from "./stores/weather.store";

type Props = ReturnType<typeof useWeatherStore> & {};

class Test extends Component<Props> {
  render(): React.ReactNode {
    console.log("rerender from Test");
    const { weather, temperature, updateWeather } = this.props;
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
            updateWeather({
              weather: "hot",
              temperature: 38,
            });
          }}
        >
          update weather
        </button>
      </div>
    );
  }
}

export default withStore(useWeatherStore, (weatherStore) => ({
  ...weatherStore,
}))(Test);
