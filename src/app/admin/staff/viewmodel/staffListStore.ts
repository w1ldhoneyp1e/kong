import {create} from 'zustand'

type StaffListState = {
	deleteConfirmId: string | null,
	setDeleteConfirmId: (id: string | null) => void,
}

const useStaffListStore = create<StaffListState>(set => ({
	deleteConfirmId: null,
	setDeleteConfirmId: id => {
		set({deleteConfirmId: id})
	},
}))

export {useStaffListStore}
