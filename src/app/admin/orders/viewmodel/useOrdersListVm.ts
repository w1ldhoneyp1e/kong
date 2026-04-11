'use client'

import {
	type ListOrdersQuery,
	type ListOrdersResult,
	useDeleteOrderMutation,
	useOrdersQuery,
} from '../../../../entities/order'
import {useOrdersListStore} from './ordersListStore'

function useOrdersListVm(initialList?: ListOrdersResult) {
	const statusFilter = useOrdersListStore(s => s.statusFilter)
	const q = useOrdersListStore(s => s.q)
	const page = useOrdersListStore(s => s.page)
	const pageSize = useOrdersListStore(s => s.pageSize)

	const listQuery: ListOrdersQuery = {
		limit: pageSize,
		offset: (page - 1) * pageSize,
		...(statusFilter !== 'all'
			? {status: statusFilter}
			: {}),
		...(q.trim()
			? {q: q.trim()}
			: {}),
	}

	const {
		data: listData,
		isLoading,
		isFetching,
		error: queryError,
	} = useOrdersQuery(listQuery, {
		initialData: initialList,
	})

	const deleteMutation = useDeleteOrderMutation()
	const deleteConfirmId = useOrdersListStore(s => s.deleteConfirmId)
	const setDeleteConfirmId = useOrdersListStore(s => s.setDeleteConfirmId)

	const orders = listData?.orders ?? []
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
		orders,
		totalCount,
		loading,
		error,
		deleteMutation,
		deleteConfirmId,
		setDeleteConfirmId,
	}
}

export {useOrdersListVm}
