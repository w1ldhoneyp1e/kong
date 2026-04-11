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
	type UpdateStaffRolePayload,
} from './types'

const adminStaffListKey = ['admin', 'staff', 'users'] as const

type UseStaffUsersQueryOptions = {
	initialData?: ListStaffResult,
}

function useStaffUsersQuery(options?: UseStaffUsersQueryOptions) {
	return useQuery({
		queryKey: adminStaffListKey,
		queryFn: () => adminStaffApi.listStaffUsers(),
		initialData: options?.initialData,
		staleTime: 0,
		refetchOnMount: 'always',
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
		onSuccess: () =>
			queryClient.invalidateQueries({queryKey: adminStaffListKey}),
	})
}

function useDeleteStaffUserMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => adminStaffApi.deleteStaffUser(id),
		onSuccess: () =>
			queryClient.invalidateQueries({queryKey: adminStaffListKey}),
	})
}

export {
	adminStaffListKey,
	useCreateStaffUserMutation,
	useDeleteStaffUserMutation,
	useStaffUsersQuery,
	useUpdateStaffRoleMutation,
}
export type {
	UseStaffUsersQueryOptions,
}
