'use client'

import {create} from 'zustand'

type ProductsListStoreState = {
	isCreateOpen: boolean,
	deleteConfirmId: string | null,
	setCreateOpen: (value: boolean) => void,
	setDeleteConfirmId: (id: string | null) => void,
}

const useProductsListStore = create<ProductsListStoreState>(set => ({
	isCreateOpen: false,
	deleteConfirmId: null,
	setCreateOpen: isCreateOpen => set({isCreateOpen}),
	setDeleteConfirmId: deleteConfirmId => set({deleteConfirmId}),
}))

export {useProductsListStore}
