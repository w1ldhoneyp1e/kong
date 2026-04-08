import {
	type DOCUMENT_KIND_OPTIONS,
	type DOCUMENT_SOURCE_TYPE_OPTIONS,
	type STATUS_OPTIONS,
} from '../constants'
import {
	type ProductDocument,
	type ProductDocumentKind,
	type ProductDocumentSourceType,
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
		material: string,
		weight: string,
		length: string,
		width: string,
		height: string,
		disabled: boolean,
		onMaterialChange: (value: string) => void,
		onWeightChange: (value: string) => void,
		onLengthChange: (value: string) => void,
		onWidthChange: (value: string) => void,
		onHeightChange: (value: string) => void,
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
		thumbnailUrl: string,
		imageDraft: string,
		galleryImages: string[],
		disabled: boolean,
		onOpen: () => void,
		onOpenChange: (open: boolean) => void,
		onThumbnailChange: (value: string) => void,
		onImageDraftChange: (value: string) => void,
		onAddImage: () => void,
		onRemoveImage: (index: number) => void,
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
