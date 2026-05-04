# @leejaehyeok/use-browser-storage

[English](./README.md) | [한국어](./README-ko.md)

A React hook for managing browser storage (localStorage and sessionStorage) with advanced features like TTL support, custom serialization, and cross-tab synchronization. Provides a simple and powerful API for persisting state in your React applications.

## 📦 Installation

```bash
npm install @leejaehyeok/use-browser-storage
```

## 🚀 Quick Start

### Basic Usage with localStorage

```tsx
import React from "react";
import { useLocalStorage } from "@leejaehyeok/use-browser-storage";

export function MyComponent() {
  const { value, setValue } = useLocalStorage({
    key: "user-name",
    defaultValue: "",
  });

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter your name" />
      <p>Saved: {value}</p>
    </div>
  );
}
```

### With Cross-Tab Synchronization

```tsx
import React from "react";
import { useLocalStorage } from "@leejaehyeok/use-browser-storage";

export function MyComponent() {
  const { value, setValue } = useLocalStorage({
    key: "user-theme",
    defaultValue: "light",
    subscribe: true, // Enable cross-tab sync
  });

  return (
    <div>
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
```

### With TTL (Time To Live)

```tsx
import React from "react";
import { useLocalStorageWithTTL, ttl } from "@leejaehyeok/use-browser-storage";

export function MyComponent() {
  const { value, setValue } = useLocalStorageWithTTL({
    key: "session-token",
    defaultValue: "",
    ttl: ttl.hours(1), // Expires in 1 hour
  });

  return <p>Token: {value}</p>;
}
```

## 🎯 Core Hooks

### useBrowserStorage

The base hook for managing both localStorage and sessionStorage.

```tsx
import { useBrowserStorage } from "@leejaehyeok/use-browser-storage";

const { value, setValue, removeValue } = useBrowserStorage({
  storageType: "local", // "local" | "session"
  key: "my-key",
  defaultValue: "initial",
  serialize: JSON.stringify, // Optional: custom serializer
  deserialize: JSON.parse, // Optional: custom deserializer
});
```

**Parameters:**

- `storageType`: `"local"` or `"session"` - which storage to use
- `key`: Unique identifier for the storage item
- `defaultValue`: Value returned when key doesn't exist
- `serialize`: (Optional) Custom serialization function
- `deserialize`: (Optional) Custom deserialization function

**Returns:**

- `value`: The current stored value
- `setValue`: Function to update the value
- `removeValue`: Function to remove the item from storage
- `dispatch`: Internal dispatch function for advanced use

### useBrowserStorageWithTTL

Extended version of `useBrowserStorage` with Time To Live expiration support.

```tsx
import { useBrowserStorageWithTTL, ttl } from "@leejaehyeok/use-browser-storage";

const { value, setValue } = useBrowserStorageWithTTL({
  storageType: "local",
  key: "cached-data",
  defaultValue: null,
  ttl: ttl.minutes(30), // Expires in 30 minutes
});
```

**Additional Parameters:**

- `ttl`: (Optional) Time to live in milliseconds

### useLocalStorage

Simplified hook for localStorage with built-in cross-tab synchronization support.

```tsx
import { useLocalStorage } from "@leejaehyeok/use-browser-storage";

const { value, setValue, removeValue } = useLocalStorage({
  key: "my-key",
  defaultValue: "initial",
  subscribe: false, // Enable to sync across browser tabs
});
```

**Parameters:**

- `key`: Unique identifier for the storage item
- `defaultValue`: Value returned when key doesn't exist
- `subscribe`: (Optional) Enable cross-tab synchronization (listens to storage events)
- `serialize`: (Optional) Custom serialization function
- `deserialize`: (Optional) Custom deserialization function

**Key Feature:** When `subscribe` is `true`, changes made to the same key in other tabs will automatically update the value in the current tab.

### useLocalStorageWithTTL

localStorage with TTL expiration support.

```tsx
import { useLocalStorageWithTTL, ttl } from "@leejaehyeok/use-browser-storage";

const { value, setValue } = useLocalStorageWithTTL({
  key: "auth-token",
  defaultValue: "",
  ttl: ttl.hours(24),
  subscribe: true,
});
```

### useSessionStorage

Hook for sessionStorage (cleared when tab is closed).

```tsx
import { useSessionStorage } from "@leejaehyeok/use-browser-storage";

const { value, setValue, removeValue } = useSessionStorage({
  key: "my-key",
  defaultValue: "initial",
});
```

### useSessionStorageWithTTL

sessionStorage with TTL expiration support.

```tsx
import { useSessionStorageWithTTL, ttl } from "@leejaehyeok/use-browser-storage";

const { value, setValue } = useSessionStorageWithTTL({
  key: "page-scroll",
  defaultValue: 0,
  ttl: ttl.minutes(10),
});
```

## 🛠️ Utility Functions

### browserStorage

Low-level utility object for direct storage operations.

```tsx
import { browserStorage } from "@leejaehyeok/use-browser-storage";

// Get value
const result = browserStorage.get("local", "my-key", JSON.parse);
if (result.success) {
  console.log(result.value);
} else {
  console.error(result.error); // "NOT_FOUND" | "PARSE_ERROR" | etc.
}

// Set value
const setResult = browserStorage.set("local", "my-key", value, JSON.stringify);

// Remove value
browserStorage.remove("local", "my-key");

// Clear all
browserStorage.clear("local");

// Check existence
const exists = browserStorage.has("local", "my-key");

// Get item count
const count = browserStorage.length("local");

// Get keys
const keysResult = browserStorage.keys("local");
if (keysResult.success) {
  console.log(keysResult.value); // string[]
}

// Subscribe to changes
const unsubscribe = browserStorage.subscribe(
  "my-key",
  (event) => {
    if (event.success) {
      console.log("New value:", event.newParsedValue);
    }
  },
  JSON.parse,
);
// Call unsubscribe() to stop listening
```

**Available Methods:**

- `get(storageType, key, deserialize)` - Get value by key
- `set(storageType, key, value, serialize)` - Set value by key
- `remove(storageType, key)` - Remove value by key
- `clear(storageType)` - Clear all items
- `has(storageType, key)` - Check if key exists
- `length(storageType)` - Get item count
- `key(storageType, index)` - Get key at index
- `keys(storageType)` - Get all keys
- `subscribe(key, callback, deserialize)` - Listen for storage changes

### TTL Utilities

Helper functions to convert time units to milliseconds.

```tsx
import { ttl } from "@leejaehyeok/use-browser-storage";

ttl.ms(5000); // 5000 milliseconds
ttl.seconds(30); // 30 seconds = 30,000 ms
ttl.minutes(5); // 5 minutes = 300,000 ms
ttl.hours(1); // 1 hour = 3,600,000 ms
ttl.days(7); // 7 days = 604,800,000 ms
ttl.weeks(2); // 2 weeks = 1,209,600,000 ms
```

### Serializers

Pre-built serializers for complex data types.

```tsx
import { serializer } from "@leejaehyeok/use-browser-storage";

// Map serializer
const { value: myMap } = useLocalStorage({
  key: "my-map",
  defaultValue: new Map(),
  ...serializer.map(),
});

// Set serializer
const { value: mySet } = useLocalStorage({
  key: "my-set",
  defaultValue: new Set(),
  ...serializer.set(),
});

// Date serializer
const { value: myDate } = useLocalStorage({
  key: "my-date",
  defaultValue: new Date(),
  ...serializer.date(),
});

// URL serializer
const { value: myUrl } = useLocalStorage({
  key: "my-url",
  defaultValue: new URL("https://example.com"),
  ...serializer.url(),
});

// BigInt serializer
const { value: myBigInt } = useLocalStorage({
  key: "my-bigint",
  defaultValue: 0n,
  ...serializer.bigint(),
});
```

**Available Serializers:**

- `serializer.map()` - Serialize Map objects
- `serializer.set()` - Serialize Set objects
- `serializer.date()` - Serialize Date objects
- `serializer.url()` - Serialize URL objects
- `serializer.bigint()` - Serialize BigInt values

## 🧠 Key Features

- **Flexible Storage:** Support for both localStorage and sessionStorage
- **TTL Support:** Automatic expiration of stored values
- **Custom Serialization:** Use built-in serializers or create your own
- **Cross-Tab Sync:** Synchronize state across browser tabs with `subscribe` option
- **Type Safety:** Full TypeScript support
- **Error Handling:** Comprehensive error reporting (NOT_FOUND, PARSE_ERROR, QUOTA_EXCEEDED, etc.)
- **SSR Compatible:** Safely handles server-side rendering environments

## 🔗 Links

- [GitHub Repository](https://github.com/leejh1316/react-hooks)
- [Package Source Code](https://github.com/leejh1316/react-hooks/tree/master/packages/use-browser-storage)
- [Issue Tracker](https://github.com/leejh1316/react-hooks/issues)

## 📄 License

MIT © [leejh1316](https://github.com/leejh1316)
