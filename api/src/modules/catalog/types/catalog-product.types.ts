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
}

export type CatalogProduct = {
	id: string,
	title: string,
	subtitle: string | null,
	handle: string,
	description: string | null,
	status: 'draft' | 'published' | 'archived',
	thumbnail: string | null,
	variants: CatalogVariant[],
}
