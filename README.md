# 📦 React Native Resource Manager

A reusable set of React hooks to manage **remote data fetching** and **CRUD operations** in a clean, state-synchronized way.

This package provides a unified API to:
- Fetch paginated data from APIs
- Manage local and remote create/update/delete operations
- Normalize and extract data from API responses
- Handle loading, error, and pagination states

---

## 🚀 Installation

Add the hooks folder to your React Native or React project and import from:

```ts
import { useResourceManager } from '@/hooks/resource-manager-hooks';

# 🧰 Resource Manager Hooks

This package contains a set of composable React hooks to simplify **fetching**, **mutation**, and **state management** of remote resources. It enables consistent and reusable handling of async data interactions in React (and React Native) apps.

## 🔍 Overview

### Hooks Included:

- **`useFetch`** – Fetch remote data with pagination, loading, and error state management
- **`useMutation`** – Handle local and remote Create, Update, and Delete operations
- **useResourceManager** – Combines `useFetch` and `useMutation` for full data lifecycle management

---

## 🚀 Quick Start

### 1. Installation

This is a local package, so simply import from your project like:

```ts
import { useResourceManager } from '@/hooks/resourceManager';
```

Make sure your folder structure includes:

```
resourceManager/
├── useFetch.ts
├── useMutation.ts
├── useResourceManager.ts
├── resourceManager.types.ts
└── index.ts
```

### 2. Example Usage

```ts
const { state, queries, crud } = useResourceManager({
  serviceFn: fetchUsers,
  dataExtractor: (res) => ({
    data: res.users,
    totalResults: res.totalCount,
    currentPage: res.page,
    totalPages: res.totalPages,
  }),
  remote: {
    insertFn: createUser,
    updateFn: updateUser,
    deleteFn: deleteUser,
  },
});

useEffect(() => {
  queries.fetchData();
}, []);
```

### UI Rendering Example

```tsx
<FlatList
  data={state.data}
  refreshing={state.isRefreshing}
  onRefresh={queries.refetchData}
  onEndReached={queries.fetchNextPage}
  renderItem={({ item }) => (
    <UserItem user={item} onDelete={() => crud.deleteItem(item.id)} />
  )}
/>
```
---

## 📦 Hook APIs

### `useFetch({ serviceFn, dataExtractor, onError, shouldFetch })`

Returns `[state, queries, mutations]`

- `state`: data, loading states, errors, pagination
- `queries`: fetchData, fetchNextPage, refetchData
- `mutations`: addNewData, updateExistingData, deleteExistingData, etc.
---

### `useMutation({ local, remote })`

Returns: `addItem`, `updateItem`, `deleteItem` and mutation status flags
---

### `useResourceManager({ serviceFn, dataExtractor, remote, onError, shouldFetch })`

Returns:
- `state`: from `useFetch`
- `queries`: fetch-related functions
- `crud`: mutation functions from `useMutation`
---

## 🛠 Advanced Configuration

You can override:

- `dataExtractor` to customize response transformation
- `dataKey` in mutations to extract nested created/updated records
- `shouldFetch` to delay or prevent automatic fetching
---

## 🧼 Best Practices

- Keep `serviceFn` and `remote` functions stable (use `useCallback` if needed)
- Provide `dataExtractor` to handle complex API response formats
- Combine with context providers if global state is needed

---

## 📁 Type Definitions

Types are declared in `resourceManager.types.ts` and exported for use in components or higher-order abstractions.

---

## 📃 License

This is part of the DropIt project. Internal use only.
