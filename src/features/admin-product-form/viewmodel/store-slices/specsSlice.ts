import {type StateCreator} from 'zustand'
import {type ProductCreateStore} from '../store-types'

type SpecsSlice = Pick<
	ProductCreateStore,
	| 'material'
	| 'weight'
	| 'length'
	| 'width'
	| 'height'
	| 'specsSectionExpanded'
	| 'setMaterial'
	| 'setWeight'
	| 'setLength'
	| 'setWidth'
	| 'setHeight'
	| 'setSpecsSectionExpanded'
	| 'toggleSpecsSectionExpanded'
>

function getSpecsSliceInitialState() {
	return {
		material: '',
		weight: '',
		length: '',
		width: '',
		height: '',
		specsSectionExpanded: false,
	}
}

const createSpecsSlice: StateCreator<ProductCreateStore, [], [], SpecsSlice> = set => ({
	...getSpecsSliceInitialState(),
	setMaterial: value => set({material: value}),
	setWeight: value => set({weight: value}),
	setLength: value => set({length: value}),
	setWidth: value => set({width: value}),
	setHeight: value => set({height: value}),
	setSpecsSectionExpanded: value => set({specsSectionExpanded: value}),
	toggleSpecsSectionExpanded: () => set(state => ({
		specsSectionExpanded: !state.specsSectionExpanded,
	})),
})

export {
	createSpecsSlice,
	getSpecsSliceInitialState,
}
