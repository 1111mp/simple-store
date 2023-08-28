import { fireEvent, render, waitFor } from "@testing-library/react";

import { createStore } from "../";

type UserStore = {
  name: string;
  age: number;
};

function sleep(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

describe("test simple-store", () => {
  test("basic store", () => {
    const userStore = createStore<UserStore>({
      name: "Tom",
      age: 18,
    });

    const App: React.FC = () => {
      const [{ name, age }, updateUserStore] = userStore();

      return (
        <div>
          App:
          <br />
          name: <span data-testid="name">{name}</span>
          <br />
          age: <span data-testid="age">{age}</span>
          <br />
          <button
            onClick={() => {
              updateUserStore((store) => {
                return { name: "Jim", age: 16 };
              });
            }}
          >
            update
          </button>
        </div>
      );
    };

    const { asFragment, getByTestId, getByText } = render(<App />);

    expect(asFragment()).toMatchSnapshot();
    expect(getByTestId("name")).toHaveTextContent("Tom");
    expect(getByTestId("age")).toHaveTextContent("18");

    fireEvent.click(getByText("update"));

    expect(asFragment()).toMatchSnapshot();
    expect(getByTestId("name")).toHaveTextContent("Jim");
    expect(getByTestId("age")).toHaveTextContent("16");
  });

  test("hooks for use store", () => {
    const userStore = createStore<UserStore>({
      name: "Tom",
      age: 18,
    });

    function useUserStore() {
      const [{ name, age }, updateStore] = userStore();

      const updateName = (name: string) => {
        updateStore((store) => ({ ...store, name }));
      };

      return {
        name,
        age,
        updateName,
      };
    }

    const App: React.FC = () => {
      const { name, age, updateName } = useUserStore();

      return (
        <div>
          App:
          <br />
          name: <span data-testid="name">{name}</span>
          <br />
          age: <span data-testid="age">{age}</span>
          <br />
          <button
            onClick={() => {
              updateName("Jim");
            }}
          >
            update
          </button>
        </div>
      );
    };

    const { asFragment, getByTestId, getByText } = render(<App />);

    expect(asFragment()).toMatchSnapshot();
    expect(getByTestId("name")).toHaveTextContent("Tom");
    expect(getByTestId("age")).toHaveTextContent("18");

    fireEvent.click(getByText("update"));

    expect(asFragment()).toMatchSnapshot();
    expect(getByTestId("name")).toHaveTextContent("Jim");
    expect(getByTestId("age")).toHaveTextContent("18");
  });

  test("multiple component", () => {
    const userStore = createStore<UserStore>({
      name: "Tom",
      age: 18,
    });

    const Other: React.FC = () => {
      const [{ name, age }] = userStore();

      return (
        <div>
          Other
          <br />
          name: <span data-testid="other-name">{name}</span>
          <br />
          age: <span data-testid="other-age">{age}</span>
          <br />
        </div>
      );
    };

    const Test: React.FC = () => {
      const [{ name, age }, updateStore] = userStore();

      return (
        <div>
          Test
          <br />
          name: <span data-testid="test-name">{name}</span>
          <br />
          age: <span data-testid="test-age">{age}</span>
          <br />
          <button
            onClick={() => {
              updateStore(() => ({ name: "Jim", age: 16 }));
            }}
          >
            update
          </button>
        </div>
      );
    };

    const App: React.FC = () => {
      return (
        <div>
          <Test />
          <br />
          <Other />
        </div>
      );
    };

    const { asFragment, getByTestId, getByText } = render(<App />);

    expect(asFragment()).toMatchSnapshot();
    expect(getByTestId("test-name")).toHaveTextContent("Tom");
    expect(getByTestId("test-age")).toHaveTextContent("18");
    expect(getByTestId("other-name")).toHaveTextContent("Tom");
    expect(getByTestId("other-age")).toHaveTextContent("18");

    fireEvent.click(getByText("update"));

    expect(asFragment()).toMatchSnapshot();
    expect(getByTestId("test-name")).toHaveTextContent("Jim");
    expect(getByTestId("test-age")).toHaveTextContent("16");
    expect(getByTestId("other-name")).toHaveTextContent("Jim");
    expect(getByTestId("other-age")).toHaveTextContent("16");
  });

  test("depsFn", () => {
    const userStore = createStore<UserStore>({
      name: "Tom",
      age: 18,
    });

    const App: React.FC = () => {
      const [{ name, age }, updateUserStore] = userStore((store) => [
        store.name,
      ]);

      return (
        <div>
          App:
          <br />
          name: <span data-testid="name">{name}</span>
          <br />
          age: <span data-testid="age">{age}</span>
          <br />
          <button
            onClick={() => {
              updateUserStore((store) => {
                return { ...store, age: 20 };
              });
            }}
          >
            grow up
          </button>
        </div>
      );
    };

    const { asFragment, getByTestId, getByText } = render(<App />);

    expect(asFragment()).toMatchSnapshot();
    expect(getByTestId("name")).toHaveTextContent("Tom");
    expect(getByTestId("age")).toHaveTextContent("18");

    fireEvent.click(getByText("grow up"));

    expect(asFragment()).toMatchSnapshot();
    expect(getByTestId("name")).toHaveTextContent("Tom");
    expect(getByTestId("age")).toHaveTextContent("18");
  });

  test("multiple component with depsFn", () => {
    const userStore = createStore<UserStore>({
      name: "Tom",
      age: 18,
    });

    const Other: React.FC = () => {
      const [{ name, age }] = userStore(() => []);

      return (
        <div>
          Other
          <br />
          name: <span data-testid="other-name">{name}</span>
          <br />
          age: <span data-testid="other-age">{age}</span>
          <br />
        </div>
      );
    };

    const Test: React.FC = () => {
      const [{ name, age }, updateStore] = userStore();

      return (
        <div>
          Test
          <br />
          name: <span data-testid="test-name">{name}</span>
          <br />
          age: <span data-testid="test-age">{age}</span>
          <br />
          <button
            onClick={() => {
              updateStore(() => ({ name: "Jim", age: 16 }));
            }}
          >
            update
          </button>
        </div>
      );
    };

    const App: React.FC = () => {
      return (
        <div>
          <Test />
          <br />
          <Other />
        </div>
      );
    };

    const { asFragment, getByTestId, getByText } = render(<App />);

    expect(asFragment()).toMatchSnapshot();
    expect(getByTestId("test-name")).toHaveTextContent("Tom");
    expect(getByTestId("test-age")).toHaveTextContent("18");
    expect(getByTestId("other-name")).toHaveTextContent("Tom");
    expect(getByTestId("other-age")).toHaveTextContent("18");

    fireEvent.click(getByText("update"));

    expect(asFragment()).toMatchSnapshot();
    expect(getByTestId("test-name")).toHaveTextContent("Jim");
    expect(getByTestId("test-age")).toHaveTextContent("16");
    expect(getByTestId("other-name")).toHaveTextContent("Tom");
    expect(getByTestId("other-age")).toHaveTextContent("18");
  });

  test("async update", async () => {
    const userStore = createStore<UserStore>({
      name: "Tom",
      age: 18,
    });

    const App: React.FC = () => {
      const [{ name, age }, updateUserStore] = userStore();

      return (
        <div>
          App:
          <br />
          name: <span data-testid="name">{name}</span>
          <br />
          age: <span data-testid="age">{age}</span>
          <br />
          <br />
          <button
            onClick={async () => {
              await sleep(1000);
              updateUserStore((store) => {
                return { name: "Jim", age: 16 };
              });
            }}
          >
            update
          </button>
        </div>
      );
    };

    const { asFragment, getByTestId, getByText } = render(<App />);

    expect(asFragment()).toMatchSnapshot();
    expect(getByTestId("name")).toHaveTextContent("Tom");
    expect(getByTestId("age")).toHaveTextContent("18");

    await waitFor(
      async () => {
        fireEvent.click(getByText("update"));
        await sleep(1500);
      },
      { timeout: 2000 }
    );

    expect(asFragment()).toMatchSnapshot();
    expect(getByTestId("name")).toHaveTextContent("Jim");
    expect(getByTestId("age")).toHaveTextContent("16");
  });

  test("use update promise", async () => {
    const userStore = createStore<UserStore>({
      name: "Tom",
      age: 18,
    });

    const App: React.FC = () => {
      const [{ name, age }, updateUserStore] = userStore();

      return (
        <div>
          App:
          <br />
          name: <span data-testid="name">{name}</span>
          <br />
          age: <span data-testid="age">{age}</span>
          <br />
          <br />
          <button
            onClick={() => {
              updateUserStore(async () => {
                await sleep(1000);
                return { name: "Jim", age: 16 };
              });
            }}
          >
            update
          </button>
        </div>
      );
    };

    const { asFragment, getByTestId, getByText } = render(<App />);

    expect(asFragment()).toMatchSnapshot();
    expect(getByTestId("name")).toHaveTextContent("Tom");
    expect(getByTestId("age")).toHaveTextContent("18");

    await waitFor(
      async () => {
        fireEvent.click(getByText("update"));
        await sleep(1500);
      },
      { timeout: 2000 }
    );

    expect(asFragment()).toMatchSnapshot();
    expect(getByTestId("name")).toHaveTextContent("Jim");
    expect(getByTestId("age")).toHaveTextContent("16");
  });
});
