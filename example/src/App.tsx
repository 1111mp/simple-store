import { Info } from "./Info";
import Test from "./Test";

import { useUserStore } from "./stores/user.store";

export const App: React.FC = () => {
  const { age, name, updateName } = useUserStore();

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
          updateName();
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
    </div>
  );
};
