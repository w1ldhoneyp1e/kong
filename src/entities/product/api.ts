import {getBackendUrlOptional} from '../../shared'

type MedusaProduct = {
	id: string,
	title: string | null,
	description: string | null,
	handle: string | null,
	thumbnail: string | null,
	created_at?: string | null,
	variants?: {
		id: string,
		title: string | null,
		prices?: {amount: number}[],
	}[],
	tags?: {value: string}[],
	collection_id?: string | null,
	category_ids?: string[],
}

type ListProductsResponse = {
	products: MedusaProduct[],
	count: number,
}

function publishableApiKey(): string | undefined {
	const key = process.env.MEDUSA_PUBLISHABLE_KEY
		?? process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

	return typeof key === 'string' && key.length > 0
		? key
		: undefined
}

function buildStoreHeaders(): HeadersInit | undefined {
	const key = publishableApiKey()
	return key
		? {'x-publishable-api-key': key}
		: undefined
}

async function listProducts(params: {
	q?: string,
	limit?: number,
	offset?: number,
	categoryId?: string,
	order?: 'created_at' | 'title',
}): Promise<ListProductsResponse> {
	const searchParams = new URLSearchParams()
	if (params.q) {
		searchParams.set('q', params.q)
	}
	if (params.limit !== undefined && params.limit !== null) {
		searchParams.set('limit', String(params.limit))
	}
	if (params.offset !== undefined && params.offset !== null) {
		searchParams.set('offset', String(params.offset))
	}
	if (params.categoryId) {
		searchParams.set('category_id[]', params.categoryId)
	}
	if (params.order) {
		searchParams.set('order', params.order)
	}
	const url = `${getBackendUrlOptional()}/store/products?${searchParams}`
	const res = await fetch(url, {
		headers: buildStoreHeaders(),
		next: params.q
			? {revalidate: 0}
			: undefined,
	})
	if (!res.ok) {
		throw new Error('Failed to fetch products')
	}
	return res.json() as Promise<ListProductsResponse>
}

const POPULAR_TAGS = new Set([
	'popular',
	'hit',
	'bestseller',
	'best seller',
	'хит',
	'популярное',
])

function productPopularityScore(product: MedusaProduct): number {
	// TODO: Replace tag-based popularity with storefront statistics
	// once views, cart additions, and order counts are collected.
	const tagValues = product.tags?.map(tag => tag.value.trim().toLowerCase()) ?? []
	if (tagValues.some(value => POPULAR_TAGS.has(value))) {
		return 1
	}

	return 0
}

async function listPopularProducts(limit = 8): Promise<ListProductsResponse> {
	const candidateLimit = Math.max(limit * 3, 24)
	const response = await listProducts({
		limit: candidateLimit,
		offset: 0,
		order: 'created_at',
	})
	const products = [...response.products]
		.sort((a, b) => productPopularityScore(b) - productPopularityScore(a))
		.slice(0, limit)

	return {
		...response,
		products,
		count: products.length,
	}
}

async function getProductByHandle(handle: string): Promise<MedusaProduct | null> {
	const searchParams = new URLSearchParams()
	searchParams.set('handle', handle)
	searchParams.set('limit', '1')
	const url = `${getBackendUrlOptional()}/store/products?${searchParams}`
	const res = await fetch(url, {
		cache: 'no-store',
		headers: buildStoreHeaders(),
	})
	if (!res.ok) {
		throw new Error('Failed to fetch product by handle')
	}

	const data = await res.json() as ListProductsResponse
	return data.products[0] ?? null
}

export {
	getProductByHandle, listPopularProducts, listProducts,
}
export type {MedusaProduct, ListProductsResponse}
