'use client'

import {create} from 'zustand'
import {type Category} from '../../../entities/category'

type CategoriesStoreHandlers = {
	onUpdate: (ev: React.FormEvent) => void,
	onDelete: (id: string) => void,
	onAddChild: (category: Category) => void,
}

type CategoriesStoreState = {
	editId: string | null,
	editName: string,
	editSlug: string,
	handlers: CategoriesStoreHandlers | null,
	newName: string,
	newSlug: string,
	newParentId: string | null,
	deleteConfirmId: string | null,
	highlightParentField: boolean,
	updatePending: boolean,
	deletePending: boolean,
	deleteTargetId: string | null,
	setEdit: (category: Category) => void,
	setEditName: (value: string) => void,
	setEditSlug: (value: string) => void,
	cancelEdit: () => void,
	setHandlers: (h: CategoriesStoreHandlers) => void,
	setNewName: (value: string) => void,
	setNewSlug: (value: string) => void,
	setNewParentId: (value: string | null) => void,
	setDeleteConfirmId: (value: string | null) => void,
	setHighlightParentField: (value: boolean) => void,
	setUpdatePending: (value: boolean) => void,
	setDeletePending: (value: boolean) => void,
	setDeleteTargetId: (value: string | null) => void,
	resetCreateForm: () => void,
	update: (ev: React.FormEvent) => void,
	deleteCategory: (id: string) => void,
	addChild: (category: Category) => void,
}

const useCategoriesStore = create<CategoriesStoreState>(set => ({
	editId: null,
	editName: '',
	editSlug: '',
	handlers: null,
	newName: '',
	newSlug: '',
	newParentId: null,
	deleteConfirmId: null,
	highlightParentField: false,
	updatePending: false,
	deletePending: false,
	deleteTargetId: null,
	setEdit: category => set({
		editId: category.id,
		editName: category.name,
		editSlug: category.slug,
	}),
	setEditName: editName => set({editName}),
	setEditSlug: editSlug => set({editSlug}),
	cancelEdit: () => set({
		editId: null,
		editName: '',
		editSlug: '',
	}),
	setHandlers: handlers => set({handlers}),
	setNewName: newName => set({newName}),
	setNewSlug: newSlug => set({newSlug}),
	setNewParentId: newParentId => set({newParentId}),
	setDeleteConfirmId: deleteConfirmId => set({deleteConfirmId}),
	setHighlightParentField: highlightParentField => set({highlightParentField}),
	setUpdatePending: updatePending => set({updatePending}),
	setDeletePending: deletePending => set({deletePending}),
	setDeleteTargetId: deleteTargetId => set({deleteTargetId}),
	resetCreateForm: () => set({
		newName: '',
		newSlug: '',
		newParentId: null,
	}),
	update: ev => {
		const {handlers} = useCategoriesStore.getState()
		handlers?.onUpdate(ev)
	},
	deleteCategory: id => {
		const {handlers} = useCategoriesStore.getState()
		handlers?.onDelete(id)
	},
	addChild: category => {
		const {handlers} = useCategoriesStore.getState()
		handlers?.onAddChild(category)
	},
}))

export {useCategoriesStore}
export type {CategoriesStoreHandlers}
