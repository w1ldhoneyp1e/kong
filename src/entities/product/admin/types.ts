import {type ProductStatus} from './status'

type AdminMoneyAmount = {
	amount?: number | null,
	currency_code?: string | null,
}

type AdminProductVariant = {
	id: string,
	title?: string | null,
	sku?: string | null,
	barcode?: string | null,
	prices?: AdminMoneyAmount[],
	metadata?: {
		available?: boolean,
	} & Record<string, unknown>,
}

type AdminProductImage = {
	id: string,
	url?: string | null,
	rank?: number | null,
}

type AdminProductOption = {
	id: string,
	title?: string | null,
	values?: {
		id?: string,
		value?: string | null,
	}[],
}

type AdminProductTag = {
	id: string,
	value?: string | null,
}

type AdminProductCategory = {
	id: string,
	name?: string | null,
}

type AdminTagOption = {
	id: string,
	value?: string | null,
}

type AdminProductDocumentKind = 'instruction' | 'reference' | 'certificate' | 'other'

type AdminProductDocument = {
	id: string,
	title: string,
	kind: AdminProductDocumentKind,
	sourceType: 'url' | 'file',
	url: string,
}

type AdminProductMetadata = {
	documents?: AdminProductDocument[],
} & Record<string, unknown>

type AdminProduct = {
	id: string,
	title?: string | null,
	subtitle?: string | null,
	description?: string | null,
	handle?: string | null,
	status: ProductStatus,
	thumbnail?: string | null,
	created_at?: string | null,
	updated_at?: string | null,
	material?: string | null,
	weight?: number | null,
	length?: number | null,
	width?: number | null,
	height?: number | null,
	metadata?: AdminProductMetadata | null,
	variants?: AdminProductVariant[],
	images?: AdminProductImage[],
	options?: AdminProductOption[],
	tags?: AdminProductTag[],
	categories?: AdminProductCategory[],
}

type CreateProductPayload = {
	title: string,
	handle?: string,
	description?: string | null,
	subtitle?: string | null,
	status?: string,
	thumbnail?: string | null,
	images?: {
		id?: string,
		url: string,
	}[],
	material?: string | null,
	weight?: number | null,
	length?: number | null,
	width?: number | null,
	height?: number | null,
	tag_ids?: string[],
	category_ids?: string[],
	variants?: {
		id?: string,
		title: string,
		sku?: string,
		prices?: {
			amount: number,
			currency_code: string,
		}[],
		metadata?: {
			available?: boolean,
		} & Record<string, unknown>,
	}[],
	metadata?: {
		documents?: {
			id: string,
			title: string,
			kind: AdminProductDocumentKind,
			sourceType: 'url' | 'file',
			url: string,
		}[],
	} & Record<string, unknown>,
	discountable?: boolean,
} & Record<string, unknown>

type UpdateProductPayload = Partial<Omit<CreateProductPayload, 'title'>> & {
	title?: string,
}

export type {
	AdminMoneyAmount,
	AdminProductDocument,
	AdminProductDocumentKind,
	AdminProduct,
	AdminProductImage,
	AdminProductMetadata,
	AdminProductOption,
	AdminProductTag,
	AdminProductCategory,
	AdminTagOption,
	AdminProductVariant,
	CreateProductPayload,
	UpdateProductPayload,
}
