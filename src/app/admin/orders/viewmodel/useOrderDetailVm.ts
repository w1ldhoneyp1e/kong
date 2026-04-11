'use client'

import {useEffect, useState} from 'react'
import {
	type AdminOrder,
	useDeleteOrderMutation,
	useOrderQuery,
	useUpdateOrderMutation,
} from '../../../../entities/order'
import {useOrderDetailStore} from './orderDetailStore'

function useOrderDetailVm(
	id: string,
	initialOrder?: AdminOrder,
) {
	const {
		data: order,
		isLoading,
		isFetching,
		error: queryError,
	} = useOrderQuery(id, {
		initialData: initialOrder,
	})

	const updateMutation = useUpdateOrderMutation()
	const deleteMutation = useDeleteOrderMutation()

	const deleteConfirmOpen = useOrderDetailStore(s => s.deleteConfirmOpen)
	const setDeleteConfirmOpen = useOrderDetailStore(s => s.setDeleteConfirmOpen)

	const [statusDraft, setStatusDraft] = useState(initialOrder?.status ?? '')

	useEffect(() => {
		if (order?.status) {
			setStatusDraft(order.status)
		}
	}, [order?.status])

	const loading = isLoading || isFetching

	const errorMessage = (err: unknown): string => (err instanceof Error
		? err.message
		: String(err))

	const error
		= (queryError && errorMessage(queryError))
		?? (updateMutation.error && errorMessage(updateMutation.error))
		?? (deleteMutation.error && errorMessage(deleteMutation.error))
		?? ''

	return {
		order,
		loading,
		error,
		deleteConfirmOpen,
		setDeleteConfirmOpen,
		updateMutation,
		deleteMutation,
		statusDraft,
		setStatusDraft,
	}
}

export {useOrderDetailVm}
