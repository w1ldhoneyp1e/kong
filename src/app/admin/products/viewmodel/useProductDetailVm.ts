'use client'

import {
	type AdminProduct,
	useDeleteProductMutation,
	useProductQuery,
	useUpdateProductMutation,
} from '../../../../entities/product'
import {useProductDetailStore} from './productDetailStore'

function useProductDetailVm(
	id: string,
	initialProduct?: AdminProduct,
) {
	const {
		data: product,
		isLoading,
		isFetching,
		error: queryError,
	} = useProductQuery(id, {
		initialData: initialProduct,
	})

	const updateMutation = useUpdateProductMutation()
	const deleteMutation = useDeleteProductMutation()

	const isEditOpen = useProductDetailStore(s => s.isEditOpen)
	const deleteConfirmOpen = useProductDetailStore(s => s.deleteConfirmOpen)
	const setEditOpen = useProductDetailStore(s => s.setEditOpen)
	const setDeleteConfirmOpen = useProductDetailStore(s => s.setDeleteConfirmOpen)

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
		product,
		loading,
		error,
		isEditOpen,
		deleteConfirmOpen,
		setEditOpen,
		setDeleteConfirmOpen,
		updateMutation,
		deleteMutation,
	}
}

export {useProductDetailVm}
