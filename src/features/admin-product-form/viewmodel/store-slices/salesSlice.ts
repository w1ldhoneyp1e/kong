import {type StateCreator} from 'zustand'
import {type ProductCreateStore} from '../store-types'

type SalesSlice = Pick<
	ProductCreateStore,
	| 'variantId'
	| 'variantTitle'
	| 'variantSku'
	| 'variantPrice'
	| 'variantAvailable'
	| 'setVariantId'
	| 'setVariantTitle'
	| 'setVariantSku'
	| 'setVariantPrice'
	| 'setVariantAvailable'
>

function getSalesSliceInitialState() {
	return {
		variantId: null,
		variantTitle: '',
		variantSku: '',
		variantPrice: '',
		variantAvailable: true,
	}
}

const createSalesSlice: StateCreator<ProductCreateStore, [], [], SalesSlice> = set => ({
	...getSalesSliceInitialState(),
	setVariantId: value => set({variantId: value}),
	setVariantTitle: value => set({variantTitle: value}),
	setVariantSku: value => set({variantSku: value}),
	setVariantPrice: value => set({variantPrice: value}),
	setVariantAvailable: value => set({variantAvailable: value}),
})

export {
	createSalesSlice,
	getSalesSliceInitialState,
}
