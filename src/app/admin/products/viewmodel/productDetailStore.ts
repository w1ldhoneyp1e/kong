'use client'

import {create} from 'zustand'

type ProductDetailStoreState = {
	isEditOpen: boolean,
	deleteConfirmOpen: boolean,
	setEditOpen: (value: boolean) => void,
	setDeleteConfirmOpen: (value: boolean) => void,
}

const useProductDetailStore = create<ProductDetailStoreState>(set => ({
	isEditOpen: false,
	deleteConfirmOpen: false,
	setEditOpen: isEditOpen => set({isEditOpen}),
	setDeleteConfirmOpen: deleteConfirmOpen => set({deleteConfirmOpen}),
}))

export {useProductDetailStore}
