'use client'

import {create} from 'zustand'

type ProductDetailStoreState = {
	deleteConfirmOpen: boolean,
	setDeleteConfirmOpen: (value: boolean) => void,
}

const useProductDetailStore = create<ProductDetailStoreState>(set => ({
	deleteConfirmOpen: false,
	setDeleteConfirmOpen: deleteConfirmOpen => set({deleteConfirmOpen}),
}))

export {useProductDetailStore}
