import {create} from 'zustand'

type OrdersListState = {
	statusFilter: string,
	q: string,
	page: number,
	pageSize: number,
	deleteConfirmId: string | null,
	setStatusFilter: (v: string) => void,
	setQ: (v: string) => void,
	setPage: (p: number) => void,
	setDeleteConfirmId: (id: string | null) => void,
}

const useOrdersListStore = create<OrdersListState>(set => ({
	statusFilter: 'all',
	q: '',
	page: 1,
	pageSize: 20,
	deleteConfirmId: null,
	setStatusFilter: v => {
		set({
			statusFilter: v,
			page: 1,
		})
	},
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

export {useOrdersListStore}
