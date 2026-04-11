import {create} from 'zustand'

type CustomerDetailState = {
	deleteConfirmOpen: boolean,
	setDeleteConfirmOpen: (v: boolean) => void,
}

const useCustomerDetailStore = create<CustomerDetailState>(set => ({
	deleteConfirmOpen: false,
	setDeleteConfirmOpen: v => {
		set({deleteConfirmOpen: v})
	},
}))

export {useCustomerDetailStore}
