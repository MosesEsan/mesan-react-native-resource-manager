export { default as useFetch } from './useFetch';
export { useMutation } from './useMutation';
export { useResourceManager } from './useResourceManager';

// Optional: export types if needed externally
export * from './resourceManager.types';

// 🧠 Example Usage in a Component:
// import { useResourceManager } from '@/hooks/resourceManager';
// import { fetchUsers, createUser, updateUser, deleteUser } from '@/services/userApi';

// const UserList = () => {
//   const { state, queries, crud } = useResourceManager({
//     serviceFn: fetchUsers,
//     dataExtractor: res => ({
//       data: res.users,
//       totalResults: res.totalCount,
//       currentPage: res.page,
//       totalPages: res.totalPages,
//     }),
//     remote: {
//       insertFn: createUser,
//       updateFn: updateUser,
//       deleteFn: deleteUser,
//     },
//   });

//   useEffect(() => {
//     queries.fetchData();
//   }, []);

//   if (state.isFetching) return <LoadingSpinner />;

//   return (
//     <FlatList
//       data={state.data}
//       onEndReached={queries.fetchNextPage}
//       refreshing={state.isRefreshing}
//       onRefresh={queries.refetchData}
//       renderItem={({ item }) => <UserCard user={item} onDelete={() => crud.deleteItem(item.id)} />}
//     />
//   );
// };