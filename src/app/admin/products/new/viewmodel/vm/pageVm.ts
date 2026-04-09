import {type ProductCreateVm} from '../interface'

function createPageVm(params: {
	disabled: boolean,
	createError: string,
	onCancel: () => void,
	onSubmit: (event: React.FormEvent) => void,
}): ProductCreateVm['page'] {
	return {
		disabled: params.disabled,
		createError: params.createError,
		onCancel: params.onCancel,
		onSubmit: params.onSubmit,
	}
}

export {createPageVm}
