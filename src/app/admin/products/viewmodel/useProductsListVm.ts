'use client'

import {
	useCreateProductMutation,
	useDeleteProductMutation,
	useProductsQuery,
} from '../../../../entities/product'
import {useProductsListStore} from './productsListStore'

function useProductsListVm() {
	const {
		data: products = [],
		isLoading,
		isFetching,
		error: queryError,
	} = useProductsQuery()

	const createMutation = useCreateProductMutation()
	const deleteMutation = useDeleteProductMutation()

	const isCreateOpen = useProductsListStore(s => s.isCreateOpen)
	const deleteConfirmId = useProductsListStore(s => s.deleteConfirmId)
	const setCreateOpen = useProductsListStore(s => s.setCreateOpen)
	const setDeleteConfirmId = useProductsListStore(s => s.setDeleteConfirmId)

	const loading = isLoading || isFetching

	const errorMessage = (err: unknown): string => (err instanceof Error
		? err.message
		: String(err))

	const error
		= (queryError && errorMessage(queryError))
		?? (createMutation.error && errorMessage(createMutation.error))
		?? (deleteMutation.error && errorMessage(deleteMutation.error))
		?? ''

	return {
		products,
		loading,
		error,
		isCreateOpen,
		deleteConfirmId,
		setCreateOpen,
		setDeleteConfirmId,
		createMutation,
		deleteMutation,
	}
}

export {useProductsListVm}
