import { describe, expect, it } from "vitest";
import { serializer } from "./serializers";

describe("serializer", () => {
  it("map은 엔트리 배열로 왕복한다", () => {
    const { serialize, deserialize } = serializer.map<string, number>();
    const value = new Map([
      ["a", 1],
      ["b", 2],
    ]);

    const raw = serialize(value);

    expect(raw).toBe('[["a",1],["b",2]]');
    expect(deserialize(raw)).toEqual(value);
  });

  it("set은 배열로 왕복한다", () => {
    const { serialize, deserialize } = serializer.set<number>();
    const value = new Set([1, 2, 3]);

    const raw = serialize(value);

    expect(raw).toBe("[1,2,3]");
    expect(deserialize(raw)).toEqual(value);
  });

  it("date는 ISO 문자열로 왕복한다", () => {
    const { serialize, deserialize } = serializer.date();
    const value = new Date("2026-01-01T00:00:00.000Z");

    const raw = serialize(value);

    expect(raw).toBe("2026-01-01T00:00:00.000Z");
    expect(deserialize(raw)).toEqual(value);
  });

  it("url은 문자열로 왕복한다", () => {
    const { serialize, deserialize } = serializer.url();
    const value = new URL("https://example.com/path?q=1");

    const raw = serialize(value);

    expect(raw).toBe("https://example.com/path?q=1");
    expect(deserialize(raw).href).toBe(value.href);
  });

  it("bigint는 10진 문자열로 왕복한다", () => {
    const { serialize, deserialize } = serializer.bigint();
    const value = 9007199254740993n;

    const raw = serialize(value);

    expect(raw).toBe("9007199254740993");
    expect(deserialize(raw)).toBe(value);
  });

  it("빈 Map / Set도 왕복한다", () => {
    expect(serializer.map().deserialize(serializer.map().serialize(new Map())).size).toBe(0);
    expect(serializer.set().deserialize(serializer.set().serialize(new Set())).size).toBe(0);
  });
});
