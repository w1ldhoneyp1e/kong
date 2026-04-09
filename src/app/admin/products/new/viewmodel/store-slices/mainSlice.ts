import {type StateCreator} from 'zustand'
import {type ProductCreateStore} from '../store-types'

type MainSlice = Pick<
	ProductCreateStore,
	'title' | 'handle' | 'status' | 'setTitle' | 'setHandle' | 'setStatus'
>

function getMainSliceInitialState() {
	return {
		title: '',
		handle: '',
		status: 'draft',
	}
}

const createMainSlice: StateCreator<ProductCreateStore, [], [], MainSlice> = set => ({
	...getMainSliceInitialState(),
	setTitle: value => set({title: value}),
	setHandle: value => set({handle: value}),
	setStatus: value => set({status: value}),
})

export {
	createMainSlice,
	getMainSliceInitialState,
}
