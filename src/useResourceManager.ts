// HOOKS
import useFetch, { ServiceResponse, ExtractedData, GetDataParams, DataExtractor } from './src/useFetch';
import { useMutation, RemoteCrudFunctions } from './useMutation';

type PaginatedFetchParams = {
  serviceFn: (params: GetDataParams) => Promise<ServiceResponse>;
  onError?: (err: string) => void;
  dataExtractor?: DataExtractor;
  dataKey?: string; // Optional key to extract specific data from the response
  shouldFetch?: boolean;
  remote?: RemoteCrudFunctions;
};

// This hook combines fetching, state management, and CRUD operations
// It abstracts the logic for fetching data, extracting it, and providing CRUD operations
// It also handles remote operations like adding and removing geofences
// The actions object will contain the state and methods for fetching, adding, and removing geofences
// It uses the getData function to fetch data and the dataExtractor to process the response
// It also provides remote CRUD functions for adding and removing geofences
// The actions object will be used in the ReusableScreen component to manage the screen's data and interactions
// It will also handle the remote operations for adding and removing geofences
export const useResourceManager = ({
  serviceFn,
  onError,
  dataExtractor,
  shouldFetch = true,
  remote = {},
  dataKey = 'data', // Default key to extract data from the response
}: PaginatedFetchParams) => {
  // Data extractor - passed to useFetch hook
  if (!dataExtractor) {
    dataExtractor = (response: ServiceResponse): ExtractedData => {
      return {
        data: response?.[dataKey] || [],
        totalResults: response.pagination?.total,
        currentPage: response.pagination?.currentPage,
        totalPages: response.pagination?.totalPages,
      };
    };
  }

  // 3 - Use Paginated Fetch Hook
  const [
    state, // includes: data, error, page, hasNextPage, totalResults, isFetching, isRefreshing, isFetchingMore, setData, setPage, setHasNextPage, setTotalResults, setIsRefreshing, setIsFetchingMore
    queries, // includes: fetchData, refetchData, fetchNextPage
    mutations // includes: setData, addNewData, updateExistingData, deleteExistingData
  ] = useFetch({ serviceFn, dataExtractor, onError, shouldFetch });

  // 4 - Mutations Hook
  // Returns a set of CRUD operations for local and remote data management
  // Returns: isAdding, isUpdating, isDeleting, addItem, updateItem, deleteItem
  const crud = useMutation({ local: mutations, remote });

  // Return actions and state
  return {
    state, //State management
    queries, //Query operations
    crud, //Crud states and operations
  };
};

export default useResourceManager;
