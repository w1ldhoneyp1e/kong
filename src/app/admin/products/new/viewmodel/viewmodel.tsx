'use client'

import {useRouter} from 'next/navigation'
import {type ReactNode, useLayoutEffect} from 'react'
import {create} from 'zustand'
import {useCreateProductMutation, useProductTagsQuery} from '../../../../../entities/product'
import {randomId} from '../../../../../shared'
import {
	DOCUMENT_KIND_OPTIONS,
	DOCUMENT_SOURCE_TYPE_OPTIONS,
	STATUS_OPTIONS,
} from '../constants'
import {
	type ProductDocument,
	type ProductDocumentKind,
	type ProductDocumentSourceType,
	type ProductGalleryImageItem,
} from '../types'
import {type ProductCreateVm} from './interface'
import {ProductCreateVmProvider} from './provider'
import {
	formatMutationError,
	parseNumberOrNull,
	productSpecsHaveAnyValue,
} from './utils'

type ProductCreateStore = {
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
}

const useProductCreateStore = create<ProductCreateStore>((set, get) => ({
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

		const id = (globalThis.crypto as {randomUUID?: () => string} | undefined)
			?.randomUUID?.()
			?? `${Date.now()}_${Math.random()}`
		set(state => ({
			documents: [
				...state.documents,
				{
					id,
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
}))

function useProductCreateVmModel(): ProductCreateVm {
	const router = useRouter()
	const createMutation = useCreateProductMutation()
	const {data: tagOptions = []} = useProductTagsQuery()
	const store = useProductCreateStore()
	useLayoutEffect(() => {
		const snapshot = useProductCreateStore.getState()
		if (productSpecsHaveAnyValue({
			material: snapshot.material,
			weight: snapshot.weight,
			length: snapshot.length,
			width: snapshot.width,
			height: snapshot.height,
		})) {
			snapshot.setSpecsSectionExpanded(true)
		}
	}, [])
	const disabled = createMutation.isPending
	const createError = createMutation.error
		? formatMutationError(createMutation.error)
		: ''

	const onSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		const metadataDocuments = store.documents.map(document => ({
			id: document.id,
			title: document.title.trim(),
			kind: document.kind,
			sourceType: document.sourceType,
			url: document.url.trim(),
		})).filter(document => document.title.length > 0 && document.url.length > 0)

		createMutation.mutate(
			{
				title: store.title.trim(),
				handle: store.handle.trim() || undefined,
				status: store.status,
				thumbnail: store.galleryImages[0]?.url.trim() || null,
				images: store.galleryImages.map(item => ({url: item.url})),
				material: store.material.trim() || null,
				weight: parseNumberOrNull(store.weight),
				length: parseNumberOrNull(store.length),
				width: parseNumberOrNull(store.width),
				height: parseNumberOrNull(store.height),
				tag_ids: store.selectedTagIds,
				metadata: {
					documents: metadataDocuments,
				},
			},
			{
				onSuccess: product => {
					router.push(`/admin/products/${product.id}`)
				},
			},
		)
	}

	return {
		main: {
			title: store.title,
			handle: store.handle,
			status: store.status,
			statusOptions: STATUS_OPTIONS,
			disabled,
			onTitleChange: store.setTitle,
			onHandleChange: store.setHandle,
			onStatusChange: store.setStatus,
		},
		specs: {
			disabled,
			sectionExpanded: store.specsSectionExpanded,
			onToggleSection: store.toggleSpecsSectionExpanded,
			materialAndWeight: {
				material: {
					value: store.material,
					onChange: store.setMaterial,
				},
				weight: {
					value: store.weight,
					onChange: store.setWeight,
				},
			},
			dimensions: {
				length: {
					value: store.length,
					onChange: store.setLength,
				},
				width: {
					value: store.width,
					onChange: store.setWidth,
				},
				height: {
					value: store.height,
					onChange: store.setHeight,
				},
			},
		},
		tags: {
			selectedTagIds: store.selectedTagIds,
			tagOptions,
			disabled,
			onToggleTag: store.toggleTag,
		},
		media: {
			isOpen: store.isMediaModalOpen,
			imageDraft: store.imageDraft,
			galleryImages: store.galleryImages,
			disabled,
			uploadError: store.mediaUploadError,
			dropzoneActive: store.mediaDropzoneDepth > 0,
			onUploadErrorChange: store.setMediaUploadError,
			onDropzoneEnter: store.mediaDropzoneEnter,
			onDropzoneLeave: store.mediaDropzoneLeave,
			onDropzoneReset: store.resetMediaDropzone,
			onOpen: () => store.setMediaModalOpen(true),
			onOpenChange: store.setMediaModalOpen,
			onImageDraftChange: store.setImageDraft,
			onAddImageFromDraft: store.addGalleryImageFromDraft,
			onAddGalleryUrls: store.addGalleryUrls,
			onReorderGallery: store.reorderGalleryImages,
			onRemoveGalleryImage: store.removeGalleryImageById,
		},
		documents: {
			items: store.documents,
			isModalOpen: store.isDocumentModalOpen,
			newItem: {
				title: store.newDocTitle,
				kind: store.newDocKind,
				sourceType: store.newDocSourceType,
				url: store.newDocUrl,
			},
			kindOptions: DOCUMENT_KIND_OPTIONS,
			sourceTypeOptions: DOCUMENT_SOURCE_TYPE_OPTIONS,
			disabled,
			onOpenModal: () => store.setDocumentModalOpen(true),
			onCloseModal: () => store.setDocumentModalOpen(false),
			onOpenChange: store.setDocumentModalOpen,
			onNewTitleChange: store.setNewDocTitle,
			onNewKindChange: store.setNewDocKind,
			onNewSourceTypeChange: store.setNewDocSourceType,
			onNewUrlChange: store.setNewDocUrl,
			onAdd: store.addDocument,
			onRemove: store.removeDocument,
		},
		page: {
			disabled,
			createError,
			onCancel: () => {
				router.push('/admin/products')
			},
			onSubmit,
		},
	}
}

function ProductCreateVmModelProvider({children}: Readonly<{children: ReactNode}>) {
	const vm = useProductCreateVmModel()

	return (
		<ProductCreateVmProvider vm={vm}>
			{children}
		</ProductCreateVmProvider>
	)
}

export {
	ProductCreateVmModelProvider,
}
