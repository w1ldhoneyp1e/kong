import {STATUS_OPTIONS} from '../../constants'
import {type ProductCreateVm} from '../interface'
import {type ProductCreateStore} from '../store'

function createMainVm(
	store: ProductCreateStore,
	disabled: boolean,
): ProductCreateVm['main'] {
	return {
		title: store.title,
		handle: store.handle,
		status: store.status,
		statusOptions: STATUS_OPTIONS,
		disabled,
		onTitleChange: store.setTitle,
		onHandleChange: store.setHandle,
		onStatusChange: store.setStatus,
	}
}

export {createMainVm}
