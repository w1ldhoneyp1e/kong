import {type StateCreator} from 'zustand'
import {type ProductCreateStore} from '../store-types'

type MainSlice = Pick<
	ProductCreateStore,
	'title' | 'handle' | 'status' | 'selectedCategoryId' | 'setTitle' | 'setHandle' | 'setStatus' | 'setSelectedCategoryId'
>

function getMainSliceInitialState() {
	return {
		title: '',
		handle: '',
		status: 'draft',
		selectedCategoryId: null,
	}
}

const createMainSlice: StateCreator<ProductCreateStore, [], [], MainSlice> = set => ({
	...getMainSliceInitialState(),
	setTitle: value => set({title: value}),
	setHandle: value => set({handle: value}),
	setStatus: value => set({status: value}),
	setSelectedCategoryId: value => set({selectedCategoryId: value}),
})

export {
	createMainSlice,
	getMainSliceInitialState,
}
