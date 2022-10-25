/**
 * Extend map with find and filter till
 * https://github.com/tc39/proposal-policy-map-set
 * is implemented
 */

export class Collection<K, V> extends Map<K, V> {
  constructor() {
    super();
  }
  array<T>(fn: (k: K, v: V) => T): T[] | [] {
    const arr = [];
    for (const [k, v] of this.entries()) {
      arr.push(fn(k, v));
    }
    return arr;
  }
  find(condition: (k: K, v: V) => boolean): V | null {
    return this.#find(condition)?.[1] ?? null;
  }
  findKey(condition: (k: K, v: V) => boolean): K | null {
    return this.#find(condition)?.[0] ?? null;
  }
  #find(condition: (k: K, v: V) => boolean): [K, V] | null {
    for (const [k, v] of this.entries()) {
      if (condition(k, v)) {
        return [k, v];
      }
    }
    return null;
  }
  filter(condition: (k: K, v: V) => boolean): Collection<K, V> {
    const filteredCollection = new Collection<K, V>();
    for (const [k, v] of this.entries()) {
      if (condition(k, v)) {
        filteredCollection.set(k, v);
      }
    }
    return filteredCollection;
  }
  map<T>(fn: (k: K, v: V) => T): Collection<K, T> {
    const filteredCollection = new Collection<K, T>();
    for (const [k, v] of this.entries()) {
      filteredCollection.set(k, fn(k, v));
    }
    return filteredCollection;
  }
}
