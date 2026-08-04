import { beforeEach, describe, expect, it, vi } from "vitest";
import { browserStorage } from "./browserStorage";
import { ttl, withTTL } from "./withTTL";

const KEY = "k";
const NOW = new Date("2026-01-01T00:00:00.000Z").getTime();
const storage = withTTL(browserStorage);

describe("ttl 헬퍼", () => {
  it("단위를 밀리초로 환산한다", () => {
    expect(ttl.ms(5)).toBe(5);
    expect(ttl.seconds(1)).toBe(1000);
    expect(ttl.minutes(1)).toBe(60_000);
    expect(ttl.hours(1)).toBe(3_600_000);
    expect(ttl.days(1)).toBe(86_400_000);
    expect(ttl.weeks(1)).toBe(604_800_000);
  });
});

describe("withTTL", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  it("값과 만료 시각을 함께 저장한다", () => {
    storage.set("local", KEY, { a: 1 }, ttl.minutes(1));

    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({
      value: '{"a":1}',
      expiresAt: NOW + 60_000,
    });
  });

  it("만료 전에는 값을 그대로 돌려준다", () => {
    storage.set("local", KEY, { a: 1 }, ttl.minutes(1));

    vi.advanceTimersByTime(59_999);

    expect(storage.get("local", KEY)).toEqual({ success: true, value: { a: 1 } });
  });

  it("만료되면 NOT_FOUND를 돌려주고 키를 지운다", () => {
    storage.set("local", KEY, { a: 1 }, ttl.minutes(1));

    vi.advanceTimersByTime(60_001);

    expect(storage.get("local", KEY)).toEqual({ success: false, error: "NOT_FOUND" });
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("ttl을 주지 않으면 만료되지 않는다", () => {
    storage.set("local", KEY, { a: 1 });

    expect(JSON.parse(localStorage.getItem(KEY)!).expiresAt).toBeNull();

    vi.advanceTimersByTime(ttl.days(365));

    expect(storage.get("local", KEY)).toEqual({ success: true, value: { a: 1 } });
  });

  it("커스텀 serialize / deserialize를 사용한다", () => {
    const date = new Date("2026-06-01T00:00:00.000Z");

    storage.set("local", KEY, date, ttl.days(1), (value) => value.toISOString());
    const result = storage.get("local", KEY, (raw) => new Date(raw));

    expect(result).toEqual({ success: true, value: date });
  });

  it("직렬화할 수 없는 값이면 SERIALIZE_ERROR", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(storage.set("local", KEY, circular, ttl.minutes(1))).toEqual({ success: false, error: "SERIALIZE_ERROR" });
  });

  it("키가 없으면 NOT_FOUND", () => {
    expect(storage.get("local", "missing")).toEqual({ success: false, error: "NOT_FOUND" });
  });

  it("감싼 값을 역직렬화할 수 없으면 PARSE_ERROR", () => {
    // 래퍼는 정상이지만 안쪽 value가 깨진 경우
    localStorage.setItem(KEY, JSON.stringify({ value: "{not json", expiresAt: null }));

    expect(storage.get("local", KEY)).toEqual({ success: false, error: "PARSE_ERROR" });
  });

  it("TTL 없이 저장된 기존 값은 그대로 읽지 못한다", () => {
    // withTTL은 항상 { value, expiresAt } 래퍼를 기대한다.
    browserStorage.set("local", KEY, { a: 1 });

    // 래퍼가 아니므로 value가 undefined가 되고 JSON.parse(undefined)에서 실패한다.
    expect(storage.get("local", KEY)).toEqual({ success: false, error: "PARSE_ERROR" });
  });
});
