import React, { useEffect, useState, useRef } from "react";
import { Managger } from "./manager";

type UpdateStore<T> = (val: T | ((store: T) => T)) => void;
type DepFn<T> = (store: T) => unknown[];
type UseStore<T> = {
  (depsFn?: DepFn<T>): [T, UpdateStore<T>];
  store?: T;
};

export function createStore<T extends Record<string, unknown>>(initialVal: T) {
  const manager = new Managger<T>(initialVal);

  const useStore: UseStore<T> = (depsFn) => {
    const [, setExe] = useState<number>(0);
    const depsFnRef = useRef(depsFn);
    depsFnRef.current = depsFn;
    const depsRef = useRef<unknown[]>(
      depsFnRef.current?.(manager.getStore()) || []
    );

    useEffect(() => {
      function listener() {
        if (!depsFnRef.current) {
          return setExe((pre) => ++pre);
        }

        const oldDeps = depsRef.current;
        const newDeps = depsFnRef.current(manager.getStore());
        if (compare(oldDeps, newDeps)) {
          setExe((pre) => ++pre);
        }
        depsRef.current = newDeps;
      }

      manager.subscript(listener);

      () => {
        manager.remove(listener);
      };
    }, []);

    const updateStore: UpdateStore<T> = (store) => {
      let newStore: T;
      if (typeof store === "function") {
        newStore = store(manager.getStore());
      } else {
        newStore = store;
      }
      manager.setStore(newStore);

      manager.notyfy();
    };

    return [manager.getStore(), updateStore];
  };

  Object.defineProperty(useStore, "store", {
    get: function () {
      return manager.getStore();
    },
  });

  return useStore;
}

function compare(oldDeps: unknown[], newDeps: unknown[]) {
  if (oldDeps.length !== newDeps.length) {
    return true;
  }
  for (const index in newDeps) {
    if (oldDeps[index] !== newDeps[index]) {
      return true;
    }
  }
  return false;
}
