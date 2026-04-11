'use client'

import {
	type ListStaffResult,
	useDeleteStaffUserMutation,
	useStaffUsersQuery,
	useUpdateStaffRoleMutation,
} from '../../../../entities/staff'
import {useStaffListStore} from './staffListStore'

function useStaffListVm(initialList?: ListStaffResult) {
	const {
		data: listData,
		isLoading,
		isFetching,
		error: queryError,
	} = useStaffUsersQuery({
		initialData: initialList,
	})

	const deleteMutation = useDeleteStaffUserMutation()
	const updateRoleMutation = useUpdateStaffRoleMutation()
	const deleteConfirmId = useStaffListStore(s => s.deleteConfirmId)
	const setDeleteConfirmId = useStaffListStore(s => s.setDeleteConfirmId)

	const users = listData?.users ?? []

	const loading = isLoading || isFetching

	const errorMessage = (err: unknown): string => (err instanceof Error
		? err.message
		: String(err))

	const error
		= (queryError && errorMessage(queryError))
		?? (deleteMutation.error && errorMessage(deleteMutation.error))
		?? (updateRoleMutation.error && errorMessage(updateRoleMutation.error))
		?? ''

	return {
		users,
		loading,
		error,
		deleteMutation,
		updateRoleMutation,
		deleteConfirmId,
		setDeleteConfirmId,
	}
}

export {useStaffListVm}
