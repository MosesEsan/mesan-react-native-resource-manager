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

| Method                         | Description                               |
|--------------------------------|-------------------------------------------|
| `addItem(data, dataKey?, onSuccess?)`    | Add new item to remote/local               |
| `updateItem(id, data, dataKey?)`         | Update item by ID                          |
| `deleteItem(id)`                         | Delete item by ID                          |

#### Flags

- `isAdding`: `boolean`
- `isUpdating`: `boolean`
- `isDeleting`: `boolean`

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
