import {type AdminProductFormViewmodel} from '../interface'
import {type ProductCreateStore} from '../store-types'

function createSalesVm(
	store: ProductCreateStore,
	disabled: boolean,
): AdminProductFormViewmodel['sales'] {
	return {
		variantTitle: store.variantTitle,
		variantSku: store.variantSku,
		variantPrice: store.variantPrice,
		variantAvailable: store.variantAvailable,
		disabled,
		onVariantTitleChange: store.setVariantTitle,
		onVariantSkuChange: store.setVariantSku,
		onVariantPriceChange: store.setVariantPrice,
		onVariantAvailableChange: store.setVariantAvailable,
	}
}

export {createSalesVm}
