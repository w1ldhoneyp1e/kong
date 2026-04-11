'use client'

import {useEffect, useState} from 'react'
import {
	type StaffUser,
	useDeleteStaffUserMutation,
	useStaffUserQuery,
	useUpdateStaffRoleMutation,
} from '../../../../entities/staff'
import {useStaffDetailStore} from './staffDetailStore'

function useStaffDetailVm(
	id: string,
	initialUser?: StaffUser,
) {
	const {
		data: user,
		isLoading,
		isFetching,
		error: queryError,
	} = useStaffUserQuery(id, {
		initialData: initialUser,
	})

	const updateRoleMutation = useUpdateStaffRoleMutation()
	const deleteMutation = useDeleteStaffUserMutation()

	const deleteConfirmOpen = useStaffDetailStore(s => s.deleteConfirmOpen)
	const setDeleteConfirmOpen = useStaffDetailStore(s => s.setDeleteConfirmOpen)

	const [roleDraft, setRoleDraft] = useState(
		initialUser?.roleCode ?? '',
	)

	useEffect(() => {
		if (user?.roleCode) {
			setRoleDraft(user.roleCode)
		}
	}, [user?.roleCode])

	const loading = isLoading || isFetching

	const errorMessage = (err: unknown): string => (err instanceof Error
		? err.message
		: String(err))

	const error
		= (queryError && errorMessage(queryError))
		?? (updateRoleMutation.error && errorMessage(updateRoleMutation.error))
		?? (deleteMutation.error && errorMessage(deleteMutation.error))
		?? ''

	return {
		user,
		loading,
		error,
		deleteConfirmOpen,
		setDeleteConfirmOpen,
		updateRoleMutation,
		deleteMutation,
		roleDraft,
		setRoleDraft,
	}
}

export {useStaffDetailVm}
