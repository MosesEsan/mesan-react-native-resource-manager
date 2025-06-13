# 📘 API Reference – Resource Manager Hooks

This document provides the API reference for the hooks in the `resourceManager` system.

---

## 🔧 useFetch

Hook for managing paginated data fetching and local UI state.

### Signature
```ts
const [state, queries, mutations] = useFetch({
  serviceFn,
  dataExtractor,
  onError,
  shouldFetch
});
```

### Parameters

| Name           | Type                      | Description                                             |
|----------------|---------------------------|---------------------------------------------------------|
| `serviceFn`    | `(params: { page: number }) => Promise<any>` | Function to fetch paginated data                        |
| `dataExtractor`| `(res: any) => { data: any[], totalResults?: number, ... }` | Extracts and normalizes data from response |
| `onError`      | `(error: string) => void`  | Optional error handler                                  |
| `shouldFetch`  | `boolean`                 | Defaults to `true`. If false, disables auto-fetch       |

### Returns

#### `state`

| Key              | Type           | Description                             |
|------------------|----------------|-----------------------------------------|
| `data`           | `any[]`        | Current data list                       |
| `page`           | `number`       | Current page                            |
| `error`          | `string|null`  | Error message                           |
| `isFetching`     | `boolean`      | Indicates data is loading               |
| `isRefreshing`   | `boolean`      | Indicates refresh is in progress        |
| `isFetchingMore` | `boolean`      | Indicates pagination fetch is active    |
| `hasNextPage`    | `boolean`      | Whether more pages are available        |
| `totalResults`   | `number|null`  | Total number of records                 |

#### `queries`

- `fetchData(refresh?: boolean, page?: number, more?: boolean)`
- `refetchData()`
- `fetchNextPage()`

#### `mutations`

- `addNewData(item: any)`
- `updateExistingData(id: any, item: any)`
- `updateExistingDataWithKey(id: any, key: string, value: any)`
- `deleteExistingData(id: any)`

---

## 🔧 useMutation

Hook for handling local and remote CRUD operations.

### Signature
```ts
const crud = useMutation({
  local,
  remote
});
```

### Parameters

| Name       | Type                | Description                                 |
|------------|---------------------|---------------------------------------------|
| `local`    | `object`            | Local update methods (from `useFetch`'s `mutations`): addNewData, updateExistingData, deleteExistingData   |
| `remote`   | `object`            | Remote functions: insertFn, updateFn, deleteFn |

### Returns

#### `crud` object

The `crud` object provides methods for managing local and remote data in sync.

| Method                              | Description                                                                 |
|-------------------------------------|-----------------------------------------------------------------------------|
| `addItem(data, dataKey?, onSuccess?)` | Adds a new item by calling the remote `insertFn`, then updates local state via `addNewData`. Optionally extracts data via `dataKey` and runs `onSuccess` callback with the saved item. |
| `updateItem(id, data, dataKey?)`     | Updates an existing item via remote `updateFn`, then updates the local state using `updateExistingData`. Optionally extracts response using `dataKey`. |
| `deleteItem(id)`                     | Deletes an item remotely via `deleteFn`, and removes it from local state via `deleteExistingData`. |

---

### 🔍 Parameters

#### `dataKey` (optional, `string`)
Some APIs return the created or updated object wrapped inside a parent key:

```json
{
  "status": "success",
  "comment": {
    "id": 1,
    "content": "Nice!",
    "user_id": 42
  }
}
```

If `dataKey = 'comment'` is passed, the `comment` object will be extracted from the response and used to update the local state.

**Example:**

```ts
crud.addItem({ content: 'Nice' }, 'comment');
```

This extracts `response.comment` before adding it to local state.

---

#### `onSuccess` (optional, `(savedItem: any) => void`)
A callback function executed after a successful `addItem` operation. This runs after the item is saved remotely and added locally.

Use this for:
- UI updates (scroll, animations)
- Notifications
- Handling returned IDs or objects

**Example:**

```ts
crud.addItem(
  { content: 'Hello world', postId: 123 },
  'comment',
  (savedComment) => {
    console.log('New comment added with ID:', savedComment.id);
  }
);
```

---

### 🔁 Return Flags

These boolean flags indicate in-progress operations:

| Flag         | Type     | Description                       |
|--------------|----------|-----------------------------------|
| `isAdding`   | `boolean`| True when `addItem` is in progress |
| `isUpdating` | `boolean`| True when `updateItem` is in progress |
| `isDeleting` | `boolean`| True when `deleteItem` is in progress |
---

## 🔗 useResourceManager

High-level hook combining `useFetch` and `useMutation`.

### Signature
```ts
const { state, queries, crud } = useResourceManager({
  serviceFn,
  onError,
  dataExtractor,
  remote,
  shouldFetch
});
```

### Parameters

| Name           | Type           | Description                                     |
|----------------|----------------|-------------------------------------------------|
| `serviceFn`    | `Function`     | Required fetch function                         |
| `dataExtractor`| `Function`     | Optional parser for API response                |
| `onError`      | `Function`     | Optional error handler                          |
| `remote`       | `object`       | Optional remote CRUD handlers                   |
| `shouldFetch`  | `boolean`      | Defaults to true                                |

### Returns

- `state`: Same as `useFetch`
- `queries`: Fetch utilities
- `crud`: CRUD methods from `useMutation`

---

## 📁 File Structure

```
resourceManager/
├── useFetch.ts
├── useMutation.ts
├── useResourceManager.ts
├── resourceManager.types.ts
├── index.ts
└── API.md
```

---

MIT Licensed
