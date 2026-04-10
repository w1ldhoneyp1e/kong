import {PRODUCT_STATUS_OPTIONS} from '../../../../entities/product'
import {type AdminProductFormViewmodel} from '../interface'
import {type ProductCreateStore} from '../store-types'

function createMainVm(
	store: ProductCreateStore,
	disabled: boolean,
): AdminProductFormViewmodel['main'] {
	return {
		title: store.title,
		handle: store.handle,
		status: store.status,
		statusOptions: PRODUCT_STATUS_OPTIONS,
		disabled,
		onTitleChange: store.setTitle,
		onHandleChange: store.setHandle,
		onStatusChange: store.setStatus,
	}
}

export {createMainVm}
