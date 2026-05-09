import {type StateCreator} from 'zustand'
import {type ProductCreateStore} from '../store-types'

type SalesSlice = Pick<
	ProductCreateStore,
	| 'variantId'
	| 'variantTitle'
	| 'variantSku'
	| 'variantPrice'
	| 'variantAvailable'
	| 'variantStockQuantity'
	| 'setVariantId'
	| 'setVariantTitle'
	| 'setVariantSku'
	| 'setVariantPrice'
	| 'setVariantAvailable'
	| 'setVariantStockQuantity'
>

function getSalesSliceInitialState() {
	return {
		variantId: null,
		variantTitle: '',
		variantSku: '',
		variantPrice: '',
		variantAvailable: true,
		variantStockQuantity: null,
	}
}

const createSalesSlice: StateCreator<ProductCreateStore, [], [], SalesSlice> = set => ({
	...getSalesSliceInitialState(),
	setVariantId: value => set({variantId: value}),
	setVariantTitle: value => set({variantTitle: value}),
	setVariantSku: value => set({variantSku: value}),
	setVariantPrice: value => set({variantPrice: value}),
	setVariantAvailable: value => set({variantAvailable: value}),
	setVariantStockQuantity: value => set({variantStockQuantity: value}),
})

export {
	createSalesSlice,
	getSalesSliceInitialState,
}
