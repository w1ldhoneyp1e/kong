'use client'

import {
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import {adminOrderApi} from './api'
import {
	type AdminOrder,
	type ListOrdersQuery,
	type ListOrdersResult,
	type UpdateOrderPayload,
} from './types'

const adminOrdersListIdleKey = ['admin', 'orders', 'list', 'idle'] as const
const adminOrderDetailIdleKey = ['admin', 'orders', 'detail', 'none'] as const

function adminOrdersListQueryKey(query?: ListOrdersQuery) {
	return ['admin', 'orders', 'list', query ?? {}] as const
}

function adminOrderQueryKey(id: string) {
	return ['admin', 'orders', id] as const
}

type UseOrdersQueryOptions = {
	initialData?: ListOrdersResult,
}

type UseOrderQueryOptions = {
	initialData?: AdminOrder,
}

function useOrdersQuery(
	query?: ListOrdersQuery,
	options?: UseOrdersQueryOptions,
) {
	return useQuery({
		queryKey: adminOrdersListQueryKey(query),
		queryFn: () => adminOrderApi.listOrders(query),
		initialData: options?.initialData,
	})
}

function useOrderQuery(
	id: string | undefined,
	options?: UseOrderQueryOptions,
) {
	return useQuery({
		queryKey: id
			? adminOrderQueryKey(id)
			: adminOrderDetailIdleKey,
		queryFn: () => adminOrderApi.getOrder(id as string),
		enabled: Boolean(id),
		initialData: options?.initialData,
	})
}

function useUpdateOrderMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string,
			payload: UpdateOrderPayload,
		}) => adminOrderApi.updateOrder(id, payload),
		onSuccess: (_data, variables) =>
			Promise.all([
				queryClient.invalidateQueries({
					queryKey: ['admin', 'orders', 'list'],
				}),
				queryClient.invalidateQueries({
					queryKey: adminOrderQueryKey(variables.id),
				}),
			]),
	})
}

function useDeleteOrderMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => adminOrderApi.deleteOrder(id),
		onSuccess: (_data, id) => {
			queryClient.removeQueries({queryKey: adminOrderQueryKey(id)})

			return queryClient.invalidateQueries({
				queryKey: ['admin', 'orders', 'list'],
			})
		},
	})
}

export {
	adminOrderDetailIdleKey,
	adminOrdersListIdleKey,
	adminOrdersListQueryKey,
	adminOrderQueryKey,
	useDeleteOrderMutation,
	useOrderQuery,
	useOrdersQuery,
	useUpdateOrderMutation,
}
export type {
	UseOrderQueryOptions,
	UseOrdersQueryOptions,
}
