'use client'

import {useRouter} from 'next/navigation'
import {type ReactNode} from 'react'
import {create} from 'zustand'
import {useCreateProductMutation, useProductTagsQuery} from '../../../../../entities/product'
import {
	DOCUMENT_KIND_OPTIONS,
	DOCUMENT_SOURCE_TYPE_OPTIONS,
	STATUS_OPTIONS,
} from '../constants'
import {
	type ProductDocument,
	type ProductDocumentKind,
	type ProductDocumentSourceType,
} from '../types'
import {type ProductCreateVm} from './interface'
import {ProductCreateVmProvider} from './provider'
import {formatMutationError, parseNumberOrNull} from './utils'

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
	thumbnailUrl: string,
	imageDraft: string,
	galleryImages: string[],
	documents: ProductDocument[],
	newDocTitle: string,
	newDocKind: ProductDocumentKind,
	newDocSourceType: ProductDocumentSourceType,
	newDocUrl: string,
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
	setThumbnailUrl: (value: string) => void,
	setImageDraft: (value: string) => void,
	setNewDocTitle: (value: string) => void,
	setNewDocKind: (value: ProductDocumentKind) => void,
	setNewDocSourceType: (value: ProductDocumentSourceType) => void,
	setNewDocUrl: (value: string) => void,
	toggleTag: (id: string) => void,
	addGalleryImage: () => void,
	removeGalleryImage: (index: number) => void,
	addDocument: () => void,
	removeDocument: (id: string) => void,
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
	thumbnailUrl: '',
	imageDraft: '',
	galleryImages: [],
	documents: [],
	newDocTitle: '',
	newDocKind: 'instruction',
	newDocSourceType: 'url',
	newDocUrl: '',
	setTitle: value => set({title: value}),
	setHandle: value => set({handle: value}),
	setStatus: value => set({status: value}),
	setMaterial: value => set({material: value}),
	setWeight: value => set({weight: value}),
	setLength: value => set({length: value}),
	setWidth: value => set({width: value}),
	setHeight: value => set({height: value}),
	setMediaModalOpen: open => set({isMediaModalOpen: open}),
	setDocumentModalOpen: open => set({isDocumentModalOpen: open}),
	setThumbnailUrl: value => set({thumbnailUrl: value}),
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
	addGalleryImage: () => {
		const value = get().imageDraft.trim()
		if (!value) {
			return
		}

		set(state => ({
			galleryImages: [...state.galleryImages, value],
			imageDraft: '',
		}))
	},
	removeGalleryImage: index => set(state => ({
		galleryImages: state.galleryImages.filter((_, i) => i !== index),
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
}))

function useProductCreateVmModel(): ProductCreateVm {
	const router = useRouter()
	const createMutation = useCreateProductMutation()
	const {data: tagOptions = []} = useProductTagsQuery()
	const store = useProductCreateStore()
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
				thumbnail: store.thumbnailUrl.trim() || null,
				images: store.galleryImages.map(url => ({url})),
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
			material: store.material,
			weight: store.weight,
			length: store.length,
			width: store.width,
			height: store.height,
			disabled,
			onMaterialChange: store.setMaterial,
			onWeightChange: store.setWeight,
			onLengthChange: store.setLength,
			onWidthChange: store.setWidth,
			onHeightChange: store.setHeight,
		},
		tags: {
			selectedTagIds: store.selectedTagIds,
			tagOptions,
			disabled,
			onToggleTag: store.toggleTag,
		},
		media: {
			isOpen: store.isMediaModalOpen,
			thumbnailUrl: store.thumbnailUrl,
			imageDraft: store.imageDraft,
			galleryImages: store.galleryImages,
			disabled,
			onOpen: () => store.setMediaModalOpen(true),
			onOpenChange: store.setMediaModalOpen,
			onThumbnailChange: store.setThumbnailUrl,
			onImageDraftChange: store.setImageDraft,
			onAddImage: store.addGalleryImage,
			onRemoveImage: store.removeGalleryImage,
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
