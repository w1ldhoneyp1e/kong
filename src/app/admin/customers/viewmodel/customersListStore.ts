import {create} from 'zustand'

type CustomersListState = {
	q: string,
	page: number,
	pageSize: number,
	deleteConfirmId: string | null,
	setQ: (v: string) => void,
	setPage: (p: number) => void,
	setDeleteConfirmId: (id: string | null) => void,
}

const useCustomersListStore = create<CustomersListState>(set => ({
	q: '',
	page: 1,
	pageSize: 20,
	deleteConfirmId: null,
	setQ: v => {
		set({
			q: v,
			page: 1,
		})
	},
	setPage: p => {
		set({page: p})
	},
	setDeleteConfirmId: id => {
		set({deleteConfirmId: id})
	},
}))

export {useCustomersListStore}
