'use client'

import {
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import {adminStaffApi} from './api'
import {
	type CreateStaffPayload,
	type ListStaffResult,
	type StaffUser,
	type UpdateStaffRolePayload,
} from './types'

const adminStaffListKey = ['admin', 'staff', 'users'] as const
const adminStaffDetailIdleKey = ['admin', 'staff', 'detail', 'none'] as const

function adminStaffUserQueryKey(id: string) {
	return ['admin', 'staff', 'users', id] as const
}

type UseStaffUsersQueryOptions = {
	initialData?: ListStaffResult,
}

type UseStaffUserQueryOptions = {
	initialData?: StaffUser,
}

function useStaffUsersQuery(options?: UseStaffUsersQueryOptions) {
	return useQuery({
		queryKey: adminStaffListKey,
		queryFn: () => adminStaffApi.listStaffUsers(),
		initialData: options?.initialData,
	})
}

function useStaffUserQuery(
	id: string | undefined,
	options?: UseStaffUserQueryOptions,
) {
	return useQuery({
		queryKey: id
			? adminStaffUserQueryKey(id)
			: adminStaffDetailIdleKey,
		queryFn: () => adminStaffApi.getStaffUser(id as string),
		enabled: Boolean(id),
		initialData: options?.initialData,
	})
}

function useCreateStaffUserMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: CreateStaffPayload) =>
			adminStaffApi.createStaffUser(payload),
		onSuccess: () =>
			queryClient.invalidateQueries({queryKey: adminStaffListKey}),
	})
}

function useUpdateStaffRoleMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string,
			payload: UpdateStaffRolePayload,
		}) => adminStaffApi.updateStaffRole(id, payload),
		onSuccess: (_data, variables) =>
			Promise.all([
				queryClient.invalidateQueries({queryKey: adminStaffListKey}),
				queryClient.invalidateQueries({
					queryKey: adminStaffUserQueryKey(variables.id),
				}),
			]),
	})
}

function useDeleteStaffUserMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => adminStaffApi.deleteStaffUser(id),
		onSuccess: (_data, id) => {
			queryClient.removeQueries({queryKey: adminStaffUserQueryKey(id)})

			return queryClient.invalidateQueries({queryKey: adminStaffListKey})
		},
	})
}

export {
	adminStaffDetailIdleKey,
	adminStaffListKey,
	adminStaffUserQueryKey,
	useCreateStaffUserMutation,
	useDeleteStaffUserMutation,
	useStaffUserQuery,
	useStaffUsersQuery,
	useUpdateStaffRoleMutation,
}
export type {
	UseStaffUserQueryOptions,
	UseStaffUsersQueryOptions,
}
