import { describe, expect, it, vi } from "vitest";
import { browserStorage, getStorage } from "./browserStorage";

const KEY = "k";

describe("getStorage", () => {
  it("타입에 맞는 Storage를 돌려준다", () => {
    expect(getStorage("local")).toBe(window.localStorage);
    expect(getStorage("session")).toBe(window.sessionStorage);
  });
});

describe("browserStorage.get", () => {
  it("저장된 JSON을 역직렬화해서 돌려준다", () => {
    localStorage.setItem(KEY, JSON.stringify({ a: 1 }));

    expect(browserStorage.get("local", KEY)).toEqual({ success: true, value: { a: 1 } });
  });

  it("키가 없으면 NOT_FOUND", () => {
    expect(browserStorage.get("local", "missing")).toEqual({ success: false, error: "NOT_FOUND" });
  });

  it("JSON이 깨져 있으면 PARSE_ERROR", () => {
    localStorage.setItem(KEY, "{not json");

    expect(browserStorage.get("local", KEY)).toEqual({ success: false, error: "PARSE_ERROR" });
  });

  it("스토리지에 접근할 수 없으면 UNAVAILABLE", () => {
    vi.stubGlobal("localStorage", undefined);

    expect(browserStorage.get("local", KEY)).toEqual({ success: false, error: "UNAVAILABLE" });
  });

  it("커스텀 deserialize를 사용한다", () => {
    localStorage.setItem(KEY, "2026-01-01T00:00:00.000Z");

    const result = browserStorage.get("local", KEY, (raw) => new Date(raw));

    expect(result).toEqual({ success: true, value: new Date("2026-01-01T00:00:00.000Z") });
  });

  it("session 스토리지도 같은 방식으로 읽는다", () => {
    sessionStorage.setItem(KEY, JSON.stringify(1));

    expect(browserStorage.get("session", KEY)).toEqual({ success: true, value: 1 });
  });
});

describe("browserStorage.set", () => {
  it("직렬화해서 저장하고 저장된 문자열을 돌려준다", () => {
    const result = browserStorage.set("local", KEY, { a: 1 });

    expect(result).toEqual({ success: true, value: '{"a":1}' });
    expect(localStorage.getItem(KEY)).toBe('{"a":1}');
  });

  it("직렬화할 수 없는 값이면 SERIALIZE_ERROR", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(browserStorage.set("local", KEY, circular)).toEqual({ success: false, error: "SERIALIZE_ERROR" });
  });

  it("용량을 초과하면 QUOTA_EXCEEDED", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("full", "QuotaExceededError");
    });

    expect(browserStorage.set("local", KEY, 1)).toEqual({ success: false, error: "QUOTA_EXCEEDED" });
  });

  it("그 외 저장 실패는 UNKNOWN", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("nope");
    });

    expect(browserStorage.set("local", KEY, 1)).toEqual({ success: false, error: "UNKNOWN" });
  });

  it("스토리지에 접근할 수 없으면 UNAVAILABLE", () => {
    vi.stubGlobal("localStorage", undefined);

    expect(browserStorage.set("local", KEY, 1)).toEqual({ success: false, error: "UNAVAILABLE" });
  });

  it("커스텀 serialize를 사용한다", () => {
    browserStorage.set("local", KEY, new Date("2026-01-01T00:00:00.000Z"), (value) => value.toISOString());

    expect(localStorage.getItem(KEY)).toBe("2026-01-01T00:00:00.000Z");
  });
});

describe("browserStorage.remove", () => {
  it("키를 지운다", () => {
    localStorage.setItem(KEY, "1");

    expect(browserStorage.remove("local", KEY)).toEqual({ success: true, value: undefined });
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("스토리지에 접근할 수 없으면 UNAVAILABLE", () => {
    vi.stubGlobal("localStorage", undefined);

    expect(browserStorage.remove("local", KEY)).toEqual({ success: false, error: "UNAVAILABLE" });
  });
});

describe("browserStorage.clear", () => {
  it("해당 스토리지만 비운다", () => {
    localStorage.setItem("a", "1");
    sessionStorage.setItem("b", "2");

    expect(browserStorage.clear("local")).toEqual({ success: true, value: undefined });

    expect(localStorage.length).toBe(0);
    expect(sessionStorage.getItem("b")).toBe("2");
  });
});

describe("browserStorage.has", () => {
  it("키 존재 여부를 알려준다", () => {
    localStorage.setItem(KEY, "1");

    expect(browserStorage.has("local", KEY)).toBe(true);
    expect(browserStorage.has("local", "missing")).toBe(false);
  });

  it("스토리지에 접근할 수 없으면 false", () => {
    vi.stubGlobal("localStorage", undefined);

    expect(browserStorage.has("local", KEY)).toBe(false);
  });
});

describe("browserStorage.length / key / keys", () => {
  it("저장된 키 개수와 목록을 돌려준다", () => {
    localStorage.setItem("a", "1");
    localStorage.setItem("b", "2");

    expect(browserStorage.length("local")).toBe(2);
    expect(browserStorage.key("local", 0)).toBe("a");
    expect(browserStorage.keys("local")).toEqual({ success: true, value: ["a", "b"] });
  });

  it("범위를 벗어난 인덱스는 null", () => {
    expect(browserStorage.key("local", 99)).toBeNull();
  });

  it("스토리지에 접근할 수 없으면 각각 기본값을 돌려준다", () => {
    vi.stubGlobal("localStorage", undefined);

    expect(browserStorage.length("local")).toBe(0);
    expect(browserStorage.key("local", 0)).toBeNull();
    expect(browserStorage.keys("local")).toEqual({ success: false, error: "UNAVAILABLE" });
  });
});

describe("browserStorage.subscribe", () => {
  const dispatchStorageEvent = (init: StorageEventInit) => window.dispatchEvent(new StorageEvent("storage", init));

  it("같은 키의 storage 이벤트에서 새 값과 이전 값을 파싱해 넘긴다", () => {
    const callback = vi.fn();
    browserStorage.subscribe<number>(KEY, callback);

    dispatchStorageEvent({ key: KEY, newValue: "2", oldValue: "1" });

    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ success: true, newParsedValue: 2, oldParsedValue: 1 }));
  });

  it("다른 키의 이벤트는 무시한다", () => {
    const callback = vi.fn();
    browserStorage.subscribe(KEY, callback);

    dispatchStorageEvent({ key: "other", newValue: "2" });

    expect(callback).not.toHaveBeenCalled();
  });

  it("값이 지워지면 파싱 결과가 null이다", () => {
    const callback = vi.fn();
    browserStorage.subscribe<number>(KEY, callback);

    dispatchStorageEvent({ key: KEY, newValue: null, oldValue: "1" });

    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ success: true, newParsedValue: null, oldParsedValue: 1 }));
  });

  it("파싱에 실패하면 success: false와 PARSE_ERROR를 넘긴다", () => {
    const callback = vi.fn();
    browserStorage.subscribe(KEY, callback);

    dispatchStorageEvent({ key: KEY, newValue: "{not json" });

    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ success: false, error: "PARSE_ERROR" }));
  });

  it("반환된 해제 함수를 호출하면 더 이상 받지 않는다", () => {
    const callback = vi.fn();
    const unsubscribe = browserStorage.subscribe(KEY, callback);

    unsubscribe();
    dispatchStorageEvent({ key: KEY, newValue: "1" });

    expect(callback).not.toHaveBeenCalled();
  });

  it("콜백에 넘어오는 객체는 스프레드 사본이라 원본 StorageEvent 속성이 없다", () => {
    const callback = vi.fn();
    browserStorage.subscribe<number>(KEY, callback);

    dispatchStorageEvent({ key: KEY, newValue: "2", oldValue: "1" });

    // 타입은 StorageEvent & {...}이지만 실제로는 {...event}로 만들어 넘긴다.
    // DOM 이벤트 속성은 프로토타입에 있어 스프레드로 복사되지 않으므로 key/newValue를 읽을 수 없다.
    const received = callback.mock.calls[0][0];
    expect(received.key).toBeUndefined();
    expect(received.newValue).toBeUndefined();
  });
});
