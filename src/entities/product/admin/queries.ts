'use client'

import {
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import {adminProductApi} from './api'
import {
	type AdminProduct,
	type AdminTagOption,
	type CreateProductPayload,
	type UpdateProductPayload,
} from './types'

const adminProductsQueryKey = ['admin', 'products'] as const
const adminProductTagsQueryKey = ['admin', 'product-tags'] as const
const adminProductDetailIdleKey = ['admin', 'products', 'detail', 'none'] as const

type UseProductsQueryOptions = {
	initialData?: AdminProduct[],
}

type UseProductQueryOptions = {
	initialData?: AdminProduct,
}

function adminProductQueryKey(id: string) {
	return ['admin', 'products', id] as const
}

function useProductsQuery(options?: UseProductsQueryOptions) {
	return useQuery({
		queryKey: adminProductsQueryKey,
		queryFn: () => adminProductApi.listProducts(),
		initialData: options?.initialData,
	})
}

function useProductTagsQuery() {
	return useQuery<AdminTagOption[]>({
		queryKey: adminProductTagsQueryKey,
		queryFn: () => adminProductApi.listTags(),
	})
}

function useProductQuery(
	id: string | undefined,
	options?: UseProductQueryOptions,
) {
	return useQuery({
		queryKey: id
			? adminProductQueryKey(id)
			: adminProductDetailIdleKey,
		queryFn: () => adminProductApi.getProduct(id as string),
		enabled: Boolean(id),
		initialData: options?.initialData,
	})
}

function useCreateProductMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: CreateProductPayload) =>
			adminProductApi.createProduct(payload),
		onSuccess: () =>
			queryClient.invalidateQueries({queryKey: adminProductsQueryKey}),
	})
}

function useUpdateProductMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string,
			payload: UpdateProductPayload,
		}) => adminProductApi.updateProduct(id, payload),
		onSuccess: (_data, variables) =>
			Promise.all([
				queryClient.invalidateQueries({queryKey: adminProductsQueryKey}),
				queryClient.invalidateQueries({
					queryKey: adminProductQueryKey(variables.id),
				}),
			]),
	})
}

function useDeleteProductMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => adminProductApi.deleteProduct(id),
		onSuccess: (_data, id) => {
			queryClient.removeQueries({queryKey: adminProductQueryKey(id)})

			return queryClient.invalidateQueries({queryKey: adminProductsQueryKey})
		},
	})
}

export {
	adminProductQueryKey,
	adminProductsQueryKey,
	adminProductDetailIdleKey,
	adminProductTagsQueryKey,
	useCreateProductMutation,
	useDeleteProductMutation,
	useProductQuery,
	useProductTagsQuery,
	useProductsQuery,
	useUpdateProductMutation,
}
export type {
	UseProductQueryOptions,
	UseProductsQueryOptions,
}
