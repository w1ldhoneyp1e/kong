import {type StateCreator} from 'zustand'
import {type ProductCreateStore} from '../store-types'

type TagsSlice = Pick<ProductCreateStore, 'selectedTagIds' | 'toggleTag'>

function getTagsSliceInitialState() {
	return {
		selectedTagIds: [],
	}
}

const createTagsSlice: StateCreator<ProductCreateStore, [], [], TagsSlice> = set => ({
	...getTagsSliceInitialState(),
	toggleTag: id => set(state => ({
		selectedTagIds: state.selectedTagIds.includes(id)
			? state.selectedTagIds.filter(item => item !== id)
			: [...state.selectedTagIds, id],
	})),
})

export {
	createTagsSlice,
	getTagsSliceInitialState,
}
