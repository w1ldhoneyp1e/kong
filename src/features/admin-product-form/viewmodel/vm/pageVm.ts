import {type AdminProductFormViewmodel} from '../interface'

function createPageVm(params: {
	mode: AdminProductFormViewmodel['page']['mode'],
	title: string,
	submitLabel: string,
	disabled: boolean,
	errorText: string,
	onCancel: () => void,
	onSubmit: (event: React.FormEvent) => void,
}): AdminProductFormViewmodel['page'] {
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
