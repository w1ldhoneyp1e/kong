import {
	type ProductDocument,
	type ProductDocumentKind,
	type ProductDocumentSourceType,
	type ProductGalleryImageItem,
} from '../types'

type ProductCreateMainState = {
	title: string,
	handle: string,
	status: string,
	selectedCategoryId: string | null,
}

type ProductCreateSalesState = {
	variantId: string | null,
	variantTitle: string,
	variantSku: string,
	variantPrice: string,
	variantAvailable: boolean,
	variantStockQuantity: number | null,
}

type ProductCreateSpecsState = {
	material: string,
	weight: string,
	length: string,
	width: string,
	height: string,
	specsSectionExpanded: boolean,
}

type ProductCreateTagsState = {
	selectedTagIds: string[],
}

type ProductCreateMediaState = {
	isMediaModalOpen: boolean,
	mediaUploadError: string | null,
	mediaDropzoneDepth: number,
	imageDraft: string,
	galleryImages: ProductGalleryImageItem[],
}

type ProductCreateDocumentsState = {
	isDocumentModalOpen: boolean,
	documents: ProductDocument[],
	newDocTitle: string,
	newDocKind: ProductDocumentKind,
	newDocSourceType: ProductDocumentSourceType,
	newDocUrl: string,
}

type ProductCreateStoreState =
	& ProductCreateMainState
	& ProductCreateSalesState
	& ProductCreateSpecsState
	& ProductCreateTagsState
	& ProductCreateMediaState
	& ProductCreateDocumentsState

type ProductCreateMainActions = {
	setTitle: (value: string) => void,
	setHandle: (value: string) => void,
	setStatus: (value: string) => void,
	setSelectedCategoryId: (value: string | null) => void,
}

type ProductCreateSalesActions = {
	setVariantId: (value: string | null) => void,
	setVariantTitle: (value: string) => void,
	setVariantSku: (value: string) => void,
	setVariantPrice: (value: string) => void,
	setVariantAvailable: (value: boolean) => void,
	setVariantStockQuantity: (value: number | null) => void,
}

type ProductCreateSpecsActions = {
	setMaterial: (value: string) => void,
	setWeight: (value: string) => void,
	setLength: (value: string) => void,
	setWidth: (value: string) => void,
	setHeight: (value: string) => void,
	setSpecsSectionExpanded: (value: boolean) => void,
	toggleSpecsSectionExpanded: () => void,
}

type ProductCreateTagsActions = {
	toggleTag: (id: string) => void,
}

type ProductCreateMediaActions = {
	setMediaModalOpen: (open: boolean) => void,
	setMediaUploadError: (value: string | null) => void,
	mediaDropzoneEnter: () => void,
	mediaDropzoneLeave: () => void,
	resetMediaDropzone: () => void,
	setImageDraft: (value: string) => void,
	addGalleryImageFromDraft: () => void,
	addGalleryUrls: (urls: string[]) => void,
	reorderGalleryImages: (fromIndex: number, toIndex: number) => void,
	removeGalleryImageById: (id: string) => void,
}

type ProductCreateDocumentsActions = {
	setDocumentModalOpen: (open: boolean) => void,
	setNewDocTitle: (value: string) => void,
	setNewDocKind: (value: ProductDocumentKind) => void,
	setNewDocSourceType: (value: ProductDocumentSourceType) => void,
	setNewDocUrl: (value: string) => void,
	addDocument: () => void,
	removeDocument: (id: string) => void,
}

type ProductCreateStoreActions =
	& ProductCreateMainActions
	& ProductCreateSalesActions
	& ProductCreateSpecsActions
	& ProductCreateTagsActions
	& ProductCreateMediaActions
	& ProductCreateDocumentsActions
	& {
		reset: () => void,
	}

type ProductCreateStore = ProductCreateStoreState & ProductCreateStoreActions

export type {
	ProductCreateStore,
	ProductCreateStoreState,
}
