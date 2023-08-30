import { createStore } from "../../../";

export type UseStore = { age: number; name: number };

function fetchAge(duration: number): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(20);
    }, duration);
  });
}

export const [userStore, resetStore] = createStore<UseStore>(
  {
    age: 18,
    name: 1,
  },
  async (store) => {
    const age = await fetchAge(3000);
    return { ...store, age };
  }
);

export function useUserStore() {
  const [{ age, name }, updateStore] = userStore((store) => [store.name]);

  const updateAge = () => {
    updateStore(async (store) => {
      await fetchAge(1000);
      return {
        ...store,
        age: userStore.store.age + 1, // get userStore' age by the property of store
      };
    });
  };

  return {
    age,
    name,
    updateAge,
  };
}
