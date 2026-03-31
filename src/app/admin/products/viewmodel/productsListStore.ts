'use client'

import {create} from 'zustand'

type ProductsListStoreState = {
	deleteConfirmId: string | null,
	setDeleteConfirmId: (id: string | null) => void,
}

const useProductsListStore = create<ProductsListStoreState>(set => ({
	deleteConfirmId: null,
	setDeleteConfirmId: deleteConfirmId => set({deleteConfirmId}),
}))

export {useProductsListStore}
