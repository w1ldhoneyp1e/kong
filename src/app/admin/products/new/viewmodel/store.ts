'use client'

import {create} from 'zustand'
import {randomId} from '../../../../../shared'
import {
	type ProductDocument,
	type ProductDocumentKind,
	type ProductDocumentSourceType,
	type ProductGalleryImageItem,
} from '../types'

type ProductCreateStoreState = {
	title: string,
	handle: string,
	status: string,
	material: string,
	weight: string,
	length: string,
	width: string,
	height: string,
	selectedTagIds: string[],
	isMediaModalOpen: boolean,
	isDocumentModalOpen: boolean,
	mediaUploadError: string | null,
	mediaDropzoneDepth: number,
	imageDraft: string,
	galleryImages: ProductGalleryImageItem[],
	documents: ProductDocument[],
	newDocTitle: string,
	newDocKind: ProductDocumentKind,
	newDocSourceType: ProductDocumentSourceType,
	newDocUrl: string,
	specsSectionExpanded: boolean,
}

type ProductCreateStoreActions = {
	setTitle: (value: string) => void,
	setHandle: (value: string) => void,
	setStatus: (value: string) => void,
	setMaterial: (value: string) => void,
	setWeight: (value: string) => void,
	setLength: (value: string) => void,
	setWidth: (value: string) => void,
	setHeight: (value: string) => void,
	setMediaModalOpen: (open: boolean) => void,
	setDocumentModalOpen: (open: boolean) => void,
	setMediaUploadError: (value: string | null) => void,
	mediaDropzoneEnter: () => void,
	mediaDropzoneLeave: () => void,
	resetMediaDropzone: () => void,
	setImageDraft: (value: string) => void,
	setNewDocTitle: (value: string) => void,
	setNewDocKind: (value: ProductDocumentKind) => void,
	setNewDocSourceType: (value: ProductDocumentSourceType) => void,
	setNewDocUrl: (value: string) => void,
	toggleTag: (id: string) => void,
	addGalleryImageFromDraft: () => void,
	addGalleryUrls: (urls: string[]) => void,
	reorderGalleryImages: (fromIndex: number, toIndex: number) => void,
	removeGalleryImageById: (id: string) => void,
	addDocument: () => void,
	removeDocument: (id: string) => void,
	setSpecsSectionExpanded: (value: boolean) => void,
	toggleSpecsSectionExpanded: () => void,
	reset: () => void,
}

type ProductCreateStore = ProductCreateStoreState & ProductCreateStoreActions

function getInitialState(): ProductCreateStoreState {
	return {
		title: '',
		handle: '',
		status: 'draft',
		material: '',
		weight: '',
		length: '',
		width: '',
		height: '',
		selectedTagIds: [],
		isMediaModalOpen: false,
		isDocumentModalOpen: false,
		mediaUploadError: null,
		mediaDropzoneDepth: 0,
		imageDraft: '',
		galleryImages: [],
		documents: [],
		newDocTitle: '',
		newDocKind: 'instruction',
		newDocSourceType: 'url',
		newDocUrl: '',
		specsSectionExpanded: false,
	}
}

const useProductCreateStore = create<ProductCreateStore>((set, get) => ({
	...getInitialState(),
	setTitle: value => set({title: value}),
	setHandle: value => set({handle: value}),
	setStatus: value => set({status: value}),
	setMaterial: value => set({material: value}),
	setWeight: value => set({weight: value}),
	setLength: value => set({length: value}),
	setWidth: value => set({width: value}),
	setHeight: value => set({height: value}),
	setMediaModalOpen: open => set({
		isMediaModalOpen: open,
		mediaUploadError: null,
		mediaDropzoneDepth: 0,
	}),
	setDocumentModalOpen: open => set({isDocumentModalOpen: open}),
	setMediaUploadError: value => set({mediaUploadError: value}),
	mediaDropzoneEnter: () => set(state => ({
		mediaDropzoneDepth: state.mediaDropzoneDepth + 1,
	})),
	mediaDropzoneLeave: () => set(state => ({
		mediaDropzoneDepth: Math.max(0, state.mediaDropzoneDepth - 1),
	})),
	resetMediaDropzone: () => set({mediaDropzoneDepth: 0}),
	setImageDraft: value => set({imageDraft: value}),
	setNewDocTitle: value => set({newDocTitle: value}),
	setNewDocKind: value => set({newDocKind: value}),
	setNewDocSourceType: value => set({newDocSourceType: value}),
	setNewDocUrl: value => set({newDocUrl: value}),
	toggleTag: id => set(state => ({
		selectedTagIds: state.selectedTagIds.includes(id)
			? state.selectedTagIds.filter(item => item !== id)
			: [...state.selectedTagIds, id],
	})),
	addGalleryImageFromDraft: () => {
		const value = get().imageDraft.trim()
		if (!value) {
			return
		}

		set(state => ({
			galleryImages: [
				...state.galleryImages,
				{
					id: randomId(),
					url: value,
				},
			],
			imageDraft: '',
		}))
	},
	addGalleryUrls: urls => set(state => ({
		galleryImages: [
			...state.galleryImages,
			...urls
				.map(url => url.trim())
				.filter(Boolean)
				.map(url => ({
					id: randomId(),
					url,
				})),
		],
	})),
	reorderGalleryImages: (fromIndex, toIndex) => set(state => {
		const next = [...state.galleryImages]
		if (
			fromIndex < 0
			|| fromIndex >= next.length
			|| toIndex < 0
			|| toIndex >= next.length
		) {
			return state
		}

		const moved = next.splice(fromIndex, 1)[0]
		if (!moved) {
			return state
		}

		next.splice(toIndex, 0, moved)

		return {galleryImages: next}
	}),
	removeGalleryImageById: id => set(state => ({
		galleryImages: state.galleryImages.filter(item => item.id !== id),
	})),
	addDocument: () => {
		const {
			newDocTitle,
			newDocKind,
			newDocSourceType,
			newDocUrl,
		} = get()
		const title = newDocTitle.trim()
		const url = newDocUrl.trim()
		if (!title || !url) {
			return
		}

		set(state => ({
			documents: [
				...state.documents,
				{
					id: randomId(),
					title,
					kind: newDocKind,
					sourceType: newDocSourceType,
					url,
				},
			],
			newDocTitle: '',
			newDocUrl: '',
			isDocumentModalOpen: false,
		}))
	},
	removeDocument: id => set(state => ({
		documents: state.documents.filter(item => item.id !== id),
	})),
	setSpecsSectionExpanded: value => set({specsSectionExpanded: value}),
	toggleSpecsSectionExpanded: () => set(state => ({
		specsSectionExpanded: !state.specsSectionExpanded,
	})),
	reset: () => set(getInitialState()),
}))

export {
	useProductCreateStore,
}
export type {
	ProductCreateStore,
	ProductCreateStoreState,
}
