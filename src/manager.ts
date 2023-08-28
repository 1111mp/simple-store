type Listener<T> = (store: T) => void;

export class Managger<T = unknown> {
  constructor(
    private store: T,
    private readonly listeners = new Set<Listener<T>>()
  ) {}

  public getStore(): T {
    return this.store;
  }

  public setStore(store: T) {
    this.store = store;
  }

  public subscript(listener: Listener<T>) {
    this.listeners.add(listener);
  }

  public remove(listener: Listener<T>) {
    this.listeners.delete(listener);
  }

  public notyfy() {
    for (const listener of this.listeners) {
      listener(this.store);
    }
  }
}
