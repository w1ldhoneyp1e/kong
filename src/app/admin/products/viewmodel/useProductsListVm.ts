'use client'

import {
	type AdminProduct,
	useDeleteProductMutation,
	useProductsQuery,
	useUpdateProductStockMutation,
} from '../../../../entities/product'
import {useProductsListStore} from './productsListStore'

function useProductsListVm(initialProducts?: AdminProduct[]) {
	const {
		data: products = [],
		isLoading,
		isFetching,
		error: queryError,
	} = useProductsQuery({
		initialData: initialProducts,
	})

	const deleteMutation = useDeleteProductMutation()
	const updateStockMutation = useUpdateProductStockMutation()

	const deleteConfirmId = useProductsListStore(s => s.deleteConfirmId)
	const setDeleteConfirmId = useProductsListStore(s => s.setDeleteConfirmId)

	const loading = isLoading || isFetching

	const errorMessage = (err: unknown): string => (err instanceof Error
		? err.message
		: String(err))

	const error
		= (queryError && errorMessage(queryError))
		?? (deleteMutation.error && errorMessage(deleteMutation.error))
		?? (updateStockMutation.error && errorMessage(updateStockMutation.error))
		?? ''

	return {
		products,
		loading,
		error,
		deleteConfirmId,
		setDeleteConfirmId,
		deleteMutation,
		updateStockMutation,
	}
}

export {useProductsListVm}
