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

type AdminProduct = {
	id: string,
	title?: string | null,
	subtitle?: string | null,
	description?: string | null,
	handle?: string | null,
	status?: string | null,
	thumbnail?: string | null,
	created_at?: string | null,
	updated_at?: string | null,
	variants?: AdminProductVariant[],
	images?: AdminProductImage[],
	options?: AdminProductOption[],
}

type CreateProductPayload = {
	title: string,
	handle?: string,
	description?: string | null,
	subtitle?: string | null,
	status?: string,
	discountable?: boolean,
} & Record<string, unknown>

type UpdateProductPayload = Record<string, unknown>

export type {
	AdminMoneyAmount,
	AdminProduct,
	AdminProductImage,
	AdminProductOption,
	AdminProductVariant,
	CreateProductPayload,
	UpdateProductPayload,
}
