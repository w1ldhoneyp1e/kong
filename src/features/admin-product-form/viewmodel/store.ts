'use client'

import {create} from 'zustand'
import {
	createDocumentsSlice,
	createMainSlice,
	createMediaSlice,
	createSpecsSlice,
	createTagsSlice,
	getInitialState,
} from './store-slices'
import {type ProductCreateStore} from './store-types'

const useProductCreateStore = create<ProductCreateStore>((set, get, storeApi) => ({
	...getInitialState(),
	...createMainSlice(set, get, storeApi),
	...createSpecsSlice(set, get, storeApi),
	...createTagsSlice(set, get, storeApi),
	...createMediaSlice(set, get, storeApi),
	...createDocumentsSlice(set, get, storeApi),
	reset: () => set(getInitialState()),
}))

export {
	useProductCreateStore,
}
export type {ProductCreateStore, ProductCreateStoreState} from './store-types'
