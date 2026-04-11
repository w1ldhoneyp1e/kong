'use client'

import {
	type ListCustomersQuery,
	type ListCustomersResult,
	useCustomersQuery,
	useDeleteCustomerMutation,
} from '../../../../entities/customer'
import {useCustomersListStore} from './customersListStore'

function useCustomersListVm(initialList?: ListCustomersResult) {
	const q = useCustomersListStore(s => s.q)
	const page = useCustomersListStore(s => s.page)
	const pageSize = useCustomersListStore(s => s.pageSize)

	const listQuery: ListCustomersQuery = {
		limit: pageSize,
		offset: (page - 1) * pageSize,
		...(q.trim()
			? {q: q.trim()}
			: {}),
	}

	const {
		data: listData,
		isLoading,
		isFetching,
		error: queryError,
	} = useCustomersQuery(listQuery, {
		initialData: initialList,
	})

	const deleteMutation = useDeleteCustomerMutation()
	const deleteConfirmId = useCustomersListStore(s => s.deleteConfirmId)
	const setDeleteConfirmId = useCustomersListStore(s => s.setDeleteConfirmId)

	const customers = listData?.customers ?? []
	const totalCount = listData?.count ?? 0

	const loading = isLoading || isFetching

	const errorMessage = (err: unknown): string => (err instanceof Error
		? err.message
		: String(err))

	const error
		= (queryError && errorMessage(queryError))
		?? (deleteMutation.error && errorMessage(deleteMutation.error))
		?? ''

	return {
		customers,
		totalCount,
		loading,
		error,
		deleteMutation,
		deleteConfirmId,
		setDeleteConfirmId,
	}
}

export {useCustomersListVm}
