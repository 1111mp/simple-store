import { createStore } from "../../../";

export type UseStore = { age: number; name: number };

export const userStore = createStore<UseStore>({
  age: 18,
  name: 1,
});

export function useUserStore() {
  const [{ age, name }, updateStore] = userStore((store) => [store.name]);

  const updateName = () => {
    updateStore((store) => {
      return {
        ...store,
        age: userStore.store.age + 1, // get userStore' age by the property of store
      };
    });
  };

  return {
    age,
    name,
    updateName,
  };
}
