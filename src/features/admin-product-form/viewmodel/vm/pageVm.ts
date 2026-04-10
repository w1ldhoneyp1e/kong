import {type ProductCreateVm} from '../interface'

function createPageVm(params: {
	mode: ProductCreateVm['page']['mode'],
	title: string,
	submitLabel: string,
	disabled: boolean,
	errorText: string,
	onCancel: () => void,
	onSubmit: (event: React.FormEvent) => void,
}): ProductCreateVm['page'] {
	return {
		mode: params.mode,
		title: params.title,
		submitLabel: params.submitLabel,
		disabled: params.disabled,
		errorText: params.errorText,
		onCancel: params.onCancel,
		onSubmit: params.onSubmit,
	}
}

export {createPageVm}
