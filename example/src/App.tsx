import { Info } from "./Info";
import Test from "./Test";
import { Temp } from "./Temp";

import { useUserStore } from "./stores/user.store";

export const App: React.FC = () => {
  const { age, name, updateAge } = useUserStore();

  console.log("App update");

  return (
    <div>
      App:
      <br />
      age: {age}
      <br />
      name: {name}
      <br />
      <button
        onClick={() => {
          updateAge();
        }}
      >
        update
      </button>
      <br />
      --------------------------------------------------------
      <Info />
      <br />
      --------------------------------------------------------
      <br />
      <Test />
      --------------------------------------------------------
      <br />
      <Temp />
    </div>
  );
};
