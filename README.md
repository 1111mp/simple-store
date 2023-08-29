## simple-store

Manage your state in the easiest way for React.

## Installation

```shell
npm run install @react/simple-store
# Or
yarn add @react/simple-store
```

## Example

You can see the code: [simple-store-example](https://github.com/1111mp/simple-store/tree/main/example)

Or

[![Edit](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/simple-store-example-cfj25d)

## Quick Start

#### Basic usage

Create a `userStore` through the `createStore` method:

```typescript
// user.store.ts
import { createStore } from "@react/simple-store";

type UseStore = { name: string; age: number };

// directly assign the initialized value
export const userStore = createStore<UseStore>({
  name: "Tom",
  age: 18,
});

// Or

// Use a function to get the initialized value （sync）
export const userStore = createStore<UseStore>(() => {
  // you can do something

  return {
    name: "Tom",
    age: 18,
  };
});

// Or

// Use a function to get the initialized value (async)
// Remember this will triggers an update
export const userStore = createStore<UseStore>(
  { name: "", age: 0 },
  async () => {
    // you can do something
    const { name, age } = await fetch("/user");

    return {
      name,
      age,
    };
  }
);

// App.tsx
import { userStore } from "user.store";

export const App: React.FC = () => {
  const [{ name, age }, updateUserStore] = userStore();

  return (
    <div>
      App:
      <br />
      name: <span>{name}</span>
      <br />
      age: <span>{age}</span>
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
```

#### Custom hooks

```typescript
// user.store.ts
import { createStore } from "@react/simple-store";

type UseStore = { name: string; age: number };

const userStore = createStore<UseStore>({
  name: "Tom",
  age: 18,
});

export function useUserStore() {
  const [{ name, age }, updateUserStore] = userStore();

  const updateName = (name: string) => {
    updateUserStore((store) => ({ ...store, name }));
  };

  return {
    name,
    age,
    updateName,
  };
}

// App.tsx
import { useUserStore } from "user.store";

export const App: React.FC = () => {
  const { name, age, updateName } = useUserStore();

  return (
    <div>
      App:
      <br />
      name: <span>{name}</span>
      <br />
      age: <span>{age}</span>
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
```

> It is recommended to use custom hooks to split and manage your Store.

#### Performance optimization

With the `depsFn` function, you can control the `state` you want to subscribe to to avoid unwanted updates. This is similar to the `deps` parameter of React's `useMemo` or `useEffect`.

```typescript
import { createStore } from "@react/simple-store";

type UseStore = { name: string; age: number };

const userStore = createStore<UseStore>({
  name: "Tom",
  age: 18,
});

export function useUserNameStore() {
  // depsFn
  const [{ name }, updateUserStore] = userStore((store) => [store.name]);

  const updateName = (name: string) => {
    updateUserStore((store) => ({ ...store, name }));
  };

  return {
    name,
    updateName,
  };
}
```

#### How to use it in class components

> Cannot pass `userStore` directly to `withStore`.

```typescript
// user.store.ts
import { createStore } from "@react/simple-store";

type UseStore = { name: string; age: number };

const userStore = createStore<UseStore>({
  name: "Tom",
  age: 18,
});

export function useUserStore() {
  const [{ name, age }, updateUserStore] = userStore();

  const updateName = (name: string) => {
    updateUserStore((store) => ({ ...store, name }));
  };

  return {
    name,
    age,
    updateName,
  };
}

// App.tsx
import { Component } from "react";
import { withStore } from "@react/simple-store";
import { useUserStore } from "user.store";

type Props = ReturnType<typeof useUserStore> & {};

class App extends Component<Props> {
  render(): React.ReactNode {
    const { name, age, updateName } = this.props;

    return (
      <div>
        App
        <br />
        name: {name}
        <br />
        age: {age}
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
  }
}

export default withStore(useUserStore, (userStore) => ({
  ...userStore,
}))(App);
```

#### Dependencies between stores

Single store:

```typescript
// weather.store.ts
import { createStore } from "@react/simple-store";

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

// Test.tsx
import { Component } from "react";
import { withStore } from "@react/simple-store";
import { useWeatherStore } from "./weather.store";

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
```

Multiple Stores:

```typescript
// user.store.ts
import { createStore } from "@react/simple-store";

type UseStore = { name: string; age: number };

export const userStore = createStore<UseStore>({
  name: "Tom",
  age: 18,
});

export function useUsertore() {
  // depsFn
  const [{ name, age }, updateStore] = userStore();

  const updateUserStore = (user: Partial<UseStore>) => {
    updateStore((store) => ({ ...store, ...user }));
  };

  return {
    name,
    age,
    updateUserStore,
  };
}

// weather.store.ts
import { createStore } from "@react/simple-store";
import { useUserStore } from "./user.store";

export type WeatherStore = {
  weather: string;
  temperature: number;
};

export const weatherStore = createStore<WeatherStore>({
  weather: "sunny",
  temperature: 28,
});

export function useInfoStore() {
  const { name, age, updateUserStore } = useUserStore();
  const [{ weather, temperature }, updateWeatherStore] = weatherStore();

  const updateWeatherStore = (weather: Partial<WeatherStore>) => {
    updateStore((store) => {
      return {
        ...store,
        ...weather,
      };
    });
  };

  return {
    name,
    age,
    weather,
    temperature,
    updateUserStore
    updateWeatherStore,
  };
}
```

#### Read only

In some scenarios, we only want to read the current value of a model, without subscribing to its updates.

`useStore.store`:

```typescript
import { createStore } from "@react/simple-store";

type UseStore = { name: string; age: number };

export const userStore = createStore<UseStore>({
  name: "Tom",
  age: 18,
});

// will not subscribe to updates
export function useInfoStore() {
  const { name, age } = userStore.store;

  return {
    name,
    age,
  };
}
```

## API

#### createStore

```typescript
type Store = Record<string, unknown>;

export declare function createStore<T extends Store>(
  initial: T,
  initialFn?: (store: T) => Promise<T>
): UseStore<T>;
export declare function createStore<T extends Store>(
  initial: () => T,
  initialFn?: (store: T) => Promise<T>
): UseStore<T>;
```

Create a Store.

#### UseStore

```typescript
type UpdateStoreNormal<T> = (store: T) => T;
type UpdateStoreWithPromise<T> = (store: T) => Promise<T>;
type UpdateStore<T> = (
  val: T | UpdateStoreNormal<T> | UpdateStoreWithPromise<T>
) => void;
type DepFn<T> = (store: T) => unknown[];

type UseStore<T> = {
  (depsFn?: DepFn<T>): [T, UpdateStore<T>];
  store?: T;
};
```

Call the return value of the createStore function.

#### withStore

```typescript
export declare function withStore<TStoreProps, TOwnProps, T>(
  useStore: UseStore<T>,
  mapModelToProps: MapModelToProps<TStoreProps, TOwnProps, T>
): InferableComponentEnhancerWithProps<TStoreProps, TOwnProps>;
export declare function withStore<TStoreProps, TOwnProps, Model>(
  useStores: UseStore<any>[],
  mapModelToProps: MapModelToProps<TStoreProps, TOwnProps, any[]>
): InferableComponentEnhancerWithProps<TStoreProps, TOwnProps>;
```

Used to link `store` and `class components`, similar to `connect` of `react-redux`.
