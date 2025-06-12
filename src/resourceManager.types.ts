// Common utility interfaces

export interface ServiceResponse {
  [key: string]: any;
}

export interface GetDataParams {
  page: number;
}

export interface ExtractedData {
  data: any[];
  totalResults?: number;
  currentPage?: number;
  totalPages?: number;
}

export type DataExtractor = (response: ServiceResponse) => ExtractedData;

// useFetch types

export interface FetchState {
  data: any[];
  error: string | null;
  page: number;
  hasNextPage: boolean;
  totalResults: number | null;
  isFetching: boolean;
  isRefreshing: boolean;
  isFetchingMore: boolean;
}

export interface FetchStateWithSetters extends FetchState {
  setData: (data: any[]) => void;
  setError: (error: string | null) => void;
  setPage: (page: number) => void;
  setHasNextPage: (hasNextPage: boolean) => void;
  setTotalResults: (totalResults: number | null) => void;
  setIsFetching: (isFetching: boolean) => void;
  setIsRefreshing: (isRefreshing: boolean) => void;
  setIsFetchingMore: (isFetchingMore: boolean) => void;
}

export interface QueryActions {
  fetchData: (refresh?: boolean, page?: number, more?: boolean) => Promise<void>;
  refetchData: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
}

export interface MutationActions {
  addNewData: (newData: any) => void;
  updateExistingData: (id: any, newData: any) => void;
  updateExistingDataWithKey: (
    matchId: any,
    keyToUpdate: string,
    newValue: any,
    matchKey?: string,
  ) => void;
  deleteExistingData: (id: any) => void;
}

export interface UseFetchReturn {
  state: FetchStateWithSetters;
  queries: QueryActions;
  mutations: MutationActions;
}

// useMutation types

export interface LocalDataMutators {
  addNewData?: (data: any) => void;
  updateExistingData?: (id: string | number, data: any) => void;
  deleteExistingData?: (id: string | number) => void;
}

export interface RemoteCrudFunctions {
  insertFn?: (data: any) => Promise<any>;
  updateFn?: (id: string | number, data: any) => Promise<any>;
  deleteFn?: (id: string | number) => Promise<void>;
}

export interface CrudProps {
  local: LocalDataMutators;
  remote: RemoteCrudFunctions;
}

export interface UseMutationReturn {
  isAdding: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  addItem: (data: any, dataKey?: string, onSuccess?: (data: any) => void) => Promise<void>;
  updateItem: (id: string | number, data: any, dataKey?: string) => Promise<void>;
  deleteItem: (id: string | number) => Promise<void>;
}

// useResourceManager types

export interface PaginatedFetchParams {
  serviceFn: (params: GetDataParams) => Promise<ServiceResponse>;
  onError?: (err: string) => void;
  dataExtractor?: DataExtractor;
  dataKey?: string;
  shouldFetch?: boolean;
  remote?: RemoteCrudFunctions;
}

export interface UseResourceManagerReturn {
  state: FetchStateWithSetters;
  queries: QueryActions;
  crud: UseMutationReturn;
}