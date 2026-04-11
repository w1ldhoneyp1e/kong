import {create} from 'zustand'

type OrderDetailState = {
	deleteConfirmOpen: boolean,
	setDeleteConfirmOpen: (v: boolean) => void,
}

const useOrderDetailStore = create<OrderDetailState>(set => ({
	deleteConfirmOpen: false,
	setDeleteConfirmOpen: v => {
		set({deleteConfirmOpen: v})
	},
}))

export {useOrderDetailStore}
