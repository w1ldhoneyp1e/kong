export type CatalogMoneyAmount = {
	amount: number,
	currency_code: string,
}

export type CatalogVariant = {
	id: string,
	title: string,
	sku: string | null,
	available: boolean,
	prices: CatalogMoneyAmount[],
	metadata?: {
		available?: boolean,
	} & Record<string, unknown>,
}

export type CatalogProduct = {
	id: string,
	title: string,
	subtitle: string | null,
	handle: string,
	description: string | null,
	status: 'draft' | 'published' | 'archived',
	thumbnail: string | null,
	created_at?: string | null,
	updated_at?: string | null,
	material?: string | null,
	weight?: number | null,
	length?: number | null,
	width?: number | null,
	height?: number | null,
	metadata?: Record<string, unknown> | null,
	images?: Array<{
		id: string,
		url?: string | null,
		rank?: number | null,
	}>,
	options?: Array<{
		id: string,
		title?: string | null,
		values?: Array<{
			id?: string,
			value?: string | null,
		}>,
	}>,
	tags?: Array<{
		id: string,
		value?: string | null,
	}>,
	categories?: Array<{
		id: string,
		name?: string | null,
	}>,
	category_ids?: string[],
	collection_id?: string | null,
	variants: CatalogVariant[],
}
