import type { Serializer } from "../types";
const serializer = {
  map: <K, V>(): Serializer<Map<K, V>> => ({
    serialize: (value: Map<K, V>) => JSON.stringify(Array.from(value.entries())),
    deserialize: (raw: string) => new Map(JSON.parse(raw)),
  }),
  set: <V>(): Serializer<Set<V>> => ({
    serialize: (set) => JSON.stringify(Array.from(set)),
    deserialize: (raw: string) => new Set(JSON.parse(raw)),
  }),
  date: (): Serializer<Date> => ({
    serialize: (date) => date.toISOString(),
    deserialize: (raw: string) => new Date(raw),
  }),
  url: (): Serializer<URL> => ({
    serialize: (url) => url.toString(),
    deserialize: (raw) => new URL(raw),
  }),
  bigint: (): Serializer<bigint> => ({
    serialize: (value) => value.toString(),
    deserialize: (raw) => BigInt(raw),
  }),
} as const;

export { serializer };
