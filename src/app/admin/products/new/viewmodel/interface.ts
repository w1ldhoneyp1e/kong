import {
	type DOCUMENT_KIND_OPTIONS,
	type DOCUMENT_SOURCE_TYPE_OPTIONS,
	type STATUS_OPTIONS,
} from '../constants'
import {
	type ProductDocument,
	type ProductDocumentKind,
	type ProductDocumentSourceType,
	type ProductGalleryImageItem,
} from '../types'

type ProductCreateVm = {
	main: {
		title: string,
		handle: string,
		status: string,
		statusOptions: typeof STATUS_OPTIONS,
		disabled: boolean,
		onTitleChange: (value: string) => void,
		onHandleChange: (value: string) => void,
		onStatusChange: (value: string) => void,
	},
	specs: {
		disabled: boolean,
		sectionExpanded: boolean,
		onToggleSection: () => void,
		materialAndWeight: {
			material: {
				value: string,
				onChange: (value: string) => void,
			},
			weight: {
				value: string,
				onChange: (value: string) => void,
			},
		},
		dimensions: {
			length: {
				value: string,
				onChange: (value: string) => void,
			},
			width: {
				value: string,
				onChange: (value: string) => void,
			},
			height: {
				value: string,
				onChange: (value: string) => void,
			},
		},
	},
	tags: {
		selectedTagIds: string[],
		tagOptions: {
			id: string,
			value?: string | null,
		}[],
		disabled: boolean,
		onToggleTag: (id: string) => void,
	},
	media: {
		isOpen: boolean,
		imageDraft: string,
		galleryImages: ProductGalleryImageItem[],
		disabled: boolean,
		uploadError: string | null,
		dropzoneActive: boolean,
		onUploadErrorChange: (value: string | null) => void,
		onDropzoneEnter: () => void,
		onDropzoneLeave: () => void,
		onDropzoneReset: () => void,
		onOpen: () => void,
		onOpenChange: (open: boolean) => void,
		onImageDraftChange: (value: string) => void,
		onAddImageFromDraft: () => void,
		onAddGalleryUrls: (urls: string[]) => void,
		onReorderGallery: (fromIndex: number, toIndex: number) => void,
		onRemoveGalleryImage: (id: string) => void,
	},
	documents: {
		items: ProductDocument[],
		isModalOpen: boolean,
		newItem: {
			title: string,
			kind: ProductDocumentKind,
			sourceType: ProductDocumentSourceType,
			url: string,
		},
		kindOptions: typeof DOCUMENT_KIND_OPTIONS,
		sourceTypeOptions: typeof DOCUMENT_SOURCE_TYPE_OPTIONS,
		disabled: boolean,
		onOpenModal: () => void,
		onCloseModal: () => void,
		onOpenChange: (open: boolean) => void,
		onNewTitleChange: (value: string) => void,
		onNewKindChange: (value: ProductDocumentKind) => void,
		onNewSourceTypeChange: (value: ProductDocumentSourceType) => void,
		onNewUrlChange: (value: string) => void,
		onAdd: () => void,
		onRemove: (id: string) => void,
	},
	page: {
		disabled: boolean,
		createError: string,
		onCancel: () => void,
		onSubmit: (event: React.FormEvent) => void,
	},
}

export type {
	ProductCreateVm,
}
