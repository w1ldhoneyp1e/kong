import {create} from 'zustand'

type StaffDetailState = {
	deleteConfirmOpen: boolean,
	setDeleteConfirmOpen: (v: boolean) => void,
}

const useStaffDetailStore = create<StaffDetailState>(set => ({
	deleteConfirmOpen: false,
	setDeleteConfirmOpen: v => {
		set({deleteConfirmOpen: v})
	},
}))

export {useStaffDetailStore}
