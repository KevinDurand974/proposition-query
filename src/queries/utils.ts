import { QueryClient, UndefinedInitialDataOptions, UseMutationOptions } from "@tanstack/react-query";

type QueryKey = UndefinedInitialDataOptions["queryKey"];

type BaseQueryFn = () => unknown;
type CreateQueryReturn<QueryFn extends BaseQueryFn> = UndefinedInitialDataOptions<
	ReturnType<QueryFn>,
	Error,
	ReturnType<QueryFn>,
	QueryKey
>;
type AdditionalQueryOptions<QueryFn extends BaseQueryFn> = Omit<CreateQueryReturn<QueryFn>, "queryKey" | "queryFn">;

type BaseMutationFn = (params: any) => unknown;
type Variables<T extends BaseMutationFn> = [Parameters<T>[number]] extends [never] ? void : Parameters<T>[number];
type CreateMutationReturn<MutationFn extends BaseMutationFn> = UseMutationOptions<
	ReturnType<MutationFn>,
	Error,
	Variables<MutationFn>,
	unknown
>;
type AdditionalMutationOptions<MutationFn extends BaseMutationFn> = Omit<
	CreateMutationReturn<MutationFn>,
	"mutationFn"
>;

/**
 * A type-safe wrapper around `useQuery` that infers the type of the query key
 * and the query function.
 *
 * @param key The key to use for the query
 * @param fn The function to call when the query is run
 * @param additionalOptions Any additional options to pass to `useQuery`
 * @returns An object with the query key, query function, and any additional options
 * @example
 * const { data, error, isLoading } = useQuery(
 *   createQuery(
 *     ["user", id],
 *     async () => {
 *       const response = await fetch(`https://api.example.com/user/${id}`);
 *       return response.json();
 *     },
 *     {
 *       // Any additional options you want to pass to `useQuery`
 *       refetchOnWindowFocus: false,
 *     }
 *   )
 * );
 */
export const createQuery = <QueryFn extends BaseQueryFn>(
	key: QueryKey,
	fn: QueryFn,
	additionalOptions: AdditionalQueryOptions<QueryFn> = {}
) =>
({
	queryKey: key,
	queryFn: fn,
	...additionalOptions,
} as CreateQueryReturn<QueryFn>);

type CreateMutation = {
	<MutationFn extends BaseMutationFn>(
		fn: MutationFn,
		additionalOptions: AdditionalMutationOptions<MutationFn>,
		key: QueryKey,
		queryClient: QueryClient
	): CreateMutationReturn<MutationFn>;
	<MutationFn extends BaseMutationFn>(
		fn: MutationFn,
		key: QueryKey,
		queryClient: QueryClient
	): CreateMutationReturn<MutationFn>;
	<MutationFn extends BaseMutationFn>(
		fn: MutationFn,
		additionalOptions: AdditionalMutationOptions<MutationFn>
	): CreateMutationReturn<MutationFn>;
	<MutationFn extends BaseMutationFn>(fn: MutationFn): CreateMutationReturn<MutationFn>;
};
/**
 * A type-safe wrapper around `useMutation` that infers the type of the mutation
 * function and its variables.
 *
 * @param fn The mutation function to call when the mutation is run
 * @param additionalOptions Any additional options to pass to `useMutation`
 * @param queryKey The key to use for the mutation
 * @param queryClient The query client to use
 * @returns An object with the mutation function, any additional options, and a
 *          function to call when the mutation is successful
 * @example
 * // 4 parameters
 * const mutation = useMutation(
 *   createMutation(
 *     async (params: { id: string }) => {
 *       const response = await fetch(`https://api.example.com/user/${params.id}`);
 *       return response.json();
 *     },
 *     {
 *       // Any additional options you want to pass to `useMutation`
 *       refetchOnWindowFocus: false,
 *     },
 *     ["user", id],
 *     queryClient
 *   )
 * );
 *
 * @example
 * // 3 parameters
 * const mutation = useMutation(
 *   createMutation(
 *     async (params: { id: string }) => {
 *       const response = await fetch(`https://api.example.com/user/${params.id}`);
 *       return response.json();
 *     },
 *     ["user", id],
 *     queryClient
 *   )
 * );
 *
 * @example
 * // 2 parameters
 * const mutation = useMutation(
 *   createMutation(
 *     async (params: { id: string }) => {
 *       const response = await fetch(`https://api.example.com/user/${params.id}`);
 *       return response.json();
 *     },
 *     {
 *       // Any additional options you want to pass to `useMutation`
 *       refetchOnWindowFocus: false,
 *     }
 *   )
 * );
 *
 * @example
 * // 1 parameter
 * const mutation = useMutation(
 *   createMutation(
 *     async (params: { id: string }) => {
 *       const response = await fetch(`https://api.example.com/user/${params.id}`);
 *       return response.json();
 *     }
 *   )
 * );
 */
export const createMutation: CreateMutation = (p1, p2?, p3?, p4?) => {
	if (typeof p1 === "function" && !Array.isArray(p2) && Array.isArray(p3) && p4) {
		const mutationFn = p1 as BaseMutationFn;
		const additionalOptions = p2 as AdditionalMutationOptions<typeof p1>;
		const queryKey = p3 as QueryKey;
		const queryClient = p4 as QueryClient;

		return {
			mutationFn,
			...additionalOptions,
			onSuccess: async (data, variables, context) => {
				if (queryKey.length > 0) {
					await queryClient.invalidateQueries({ queryKey });
				}
				additionalOptions?.onSuccess?.(data, variables, context);
			},
		} as CreateMutationReturn<typeof p1>;
	}
	if (typeof p1 === "function" && Array.isArray(p2) && p3) {
		const mutationFn = p1 as BaseMutationFn;
		const queryKey = p2 as QueryKey;
		const queryClient = p3 as QueryClient;

		return {
			mutationFn,
			onSuccess: async (data, variables, context) => {
				if (queryKey.length > 0) {
					await queryClient.invalidateQueries({ queryKey });
				}
			},
		} as CreateMutationReturn<typeof p1>;
	}
	if (typeof p1 === "function" && !Array.isArray(p2)) {
		const mutationFn = p1 as BaseMutationFn;
		const additionalOptions = p2 as AdditionalMutationOptions<typeof p1>;
		return { mutationFn, ...additionalOptions } as CreateMutationReturn<typeof p1>;
	}
	const mutationFn = p1 as BaseMutationFn;
	return { mutationFn } as CreateMutationReturn<typeof p1>;
};
