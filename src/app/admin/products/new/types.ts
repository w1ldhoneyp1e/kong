type ProductDocumentKind = 'instruction' | 'reference' | 'certificate' | 'other'
type ProductDocumentSourceType = 'url' | 'file'

type ProductDocument = {
	id: string,
	title: string,
	kind: ProductDocumentKind,
	sourceType: ProductDocumentSourceType,
	url: string,
}

type ProductGalleryImageItem = {
	id: string,
	url: string,
}

export type {
	ProductDocument,
	ProductDocumentKind,
	ProductDocumentSourceType,
	ProductGalleryImageItem,
}
