'use client'

import {
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import {adminCustomerApi} from './api'
import {
	type AdminCustomer,
	type CreateCustomerPayload,
	type ListCustomersQuery,
	type ListCustomersResult,
	type UpdateCustomerPayload,
} from './types'

const adminCustomersListIdleKey = ['admin', 'customers', 'list', 'idle'] as const
const adminCustomerDetailIdleKey = ['admin', 'customers', 'detail', 'none'] as const

function adminCustomersListQueryKey(query?: ListCustomersQuery) {
	return ['admin', 'customers', 'list', query ?? {}] as const
}

function adminCustomerQueryKey(id: string) {
	return ['admin', 'customers', id] as const
}

function adminCustomerOrdersQueryKey(
	customerId: string,
	query?: {
		limit?: number,
		offset?: number,
	},
) {
	return ['admin', 'customers', customerId, 'orders', query ?? {}] as const
}

type UseCustomersQueryOptions = {
	initialData?: ListCustomersResult,
}

type UseCustomerQueryOptions = {
	initialData?: AdminCustomer,
}

function useCustomersQuery(
	query?: ListCustomersQuery,
	options?: UseCustomersQueryOptions,
) {
	return useQuery({
		queryKey: adminCustomersListQueryKey(query),
		queryFn: () => adminCustomerApi.listCustomers(query),
		initialData: options?.initialData,
	})
}

function useCustomerQuery(
	id: string | undefined,
	options?: UseCustomerQueryOptions,
) {
	return useQuery({
		queryKey: id
			? adminCustomerQueryKey(id)
			: adminCustomerDetailIdleKey,
		queryFn: () => adminCustomerApi.getCustomer(id as string),
		enabled: Boolean(id),
		initialData: options?.initialData,
	})
}

function useCustomerOrdersQuery(
	customerId: string | undefined,
	query?: {
		limit?: number,
		offset?: number,
	},
) {
	return useQuery({
		queryKey: customerId
			? adminCustomerOrdersQueryKey(customerId, query)
			: ['admin', 'customers', 'orders', 'idle'] as const,
		queryFn: () =>
			adminCustomerApi.listCustomerOrders(customerId as string, query),
		enabled: Boolean(customerId),
	})
}

function useCreateCustomerMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: CreateCustomerPayload) =>
			adminCustomerApi.createCustomer(payload),
		onSuccess: () =>
			queryClient.invalidateQueries({queryKey: ['admin', 'customers', 'list']}),
	})
}

function useUpdateCustomerMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string,
			payload: UpdateCustomerPayload,
		}) => adminCustomerApi.updateCustomer(id, payload),
		onSuccess: (_data, variables) =>
			Promise.all([
				queryClient.invalidateQueries({
					queryKey: ['admin', 'customers', 'list'],
				}),
				queryClient.invalidateQueries({
					queryKey: adminCustomerQueryKey(variables.id),
				}),
				queryClient.invalidateQueries({
					queryKey: ['admin', 'customers', variables.id, 'orders'],
				}),
			]),
	})
}

function useDeleteCustomerMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => adminCustomerApi.deleteCustomer(id),
		onSuccess: (_data, id) => {
			queryClient.removeQueries({queryKey: adminCustomerQueryKey(id)})

			return queryClient.invalidateQueries({
				queryKey: ['admin', 'customers', 'list'],
			})
		},
	})
}

export {
	adminCustomerDetailIdleKey,
	adminCustomerOrdersQueryKey,
	adminCustomersListIdleKey,
	adminCustomersListQueryKey,
	adminCustomerQueryKey,
	useCreateCustomerMutation,
	useCustomerOrdersQuery,
	useCustomerQuery,
	useCustomersQuery,
	useDeleteCustomerMutation,
	useUpdateCustomerMutation,
}
export type {
	UseCustomerQueryOptions,
	UseCustomersQueryOptions,
}
