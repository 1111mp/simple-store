import React, { useEffect, useState, useRef } from "react";
import { Managger } from "./manager";

type Store = Record<string, unknown>;
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

export function createStore<T extends Store>(
  initial: T,
  initialFn?: (store: T) => Promise<T>
): UseStore<T>;
export function createStore<T extends Store>(
  initial: () => T,
  initialFn?: (store: T) => Promise<T>
): UseStore<T>;
export function createStore<T extends Store>(
  initial: T | (() => T),
  initialFn?: (store: T) => Promise<T>
) {
  const manager = new Managger<T>(
    typeof initial == "function" ? initial() : initial
  );

  initialFn?.(manager.getStore()).then((store) => {
    manager.setStore(store);
    manager.notyfy();
  });

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
      if (typeof store !== "function") {
        manager.setStore(store);

        manager.notyfy();
        return;
      }

      const newStore = store(manager.getStore());

      if (newStore instanceof Promise) {
        newStore.then((ret) => {
          manager.setStore(ret);

          manager.notyfy();
        });
        return;
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
