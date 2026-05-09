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

function useCreateProductTagMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: {
			value: string,
			color?: string,
		}) => adminProductApi.createTag(payload),
		onSuccess: () =>
			queryClient.invalidateQueries({queryKey: adminProductTagsQueryKey}),
	})
}

function useUpdateProductTagMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string,
			payload: {
				value: string,
				color?: string,
			},
		}) => adminProductApi.updateTag(id, payload),
		onSuccess: () =>
			queryClient.invalidateQueries({queryKey: adminProductTagsQueryKey}),
	})
}

function useDeleteProductTagMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => adminProductApi.deleteTag(id),
		onSuccess: () =>
			queryClient.invalidateQueries({queryKey: adminProductTagsQueryKey}),
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

function useUpdateProductStockMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			quantity,
		}: {
			id: string,
			quantity: number,
		}) => adminProductApi.updateProductStock(id, quantity),
		onSuccess: (product, variables) => {
			queryClient.setQueryData<AdminProduct[] | undefined>(
				adminProductsQueryKey,
				current => {
					if (!Array.isArray(current)) {
						return current
					}

					return current.map(item => item.id === variables.id
						? product
						: item)
				},
			)

			queryClient.setQueryData<AdminProduct | undefined>(
				adminProductQueryKey(variables.id),
				product,
			)

			return Promise.all([
				queryClient.invalidateQueries({
					queryKey: adminProductsQueryKey,
					refetchType: 'none',
				}),
				queryClient.invalidateQueries({
					queryKey: adminProductQueryKey(variables.id),
					refetchType: 'none',
				}),
			])
		},
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
	useCreateProductTagMutation,
	useDeleteProductTagMutation,
	useCreateProductMutation,
	useDeleteProductMutation,
	useProductQuery,
	useProductTagsQuery,
	useUpdateProductTagMutation,
	useProductsQuery,
	useUpdateProductMutation,
	useUpdateProductStockMutation,
}
export type {
	UseProductQueryOptions,
	UseProductsQueryOptions,
}
