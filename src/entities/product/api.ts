import {getBackendUrlOptional} from '../../shared'

type MedusaProduct = {
	id: string,
	title: string | null,
	description: string | null,
	handle: string | null,
	thumbnail: string | null,
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
		next: params.q
			? {revalidate: 0}
			: undefined,
	})
	if (!res.ok) {
		throw new Error('Failed to fetch products')
	}
	return res.json() as Promise<ListProductsResponse>
}

async function getProductByHandle(handle: string): Promise<MedusaProduct | null> {
	const searchParams = new URLSearchParams()
	searchParams.set('handle', handle)
	searchParams.set('limit', '1')
	const url = `${getBackendUrlOptional()}/store/products?${searchParams}`
	const res = await fetch(url, {cache: 'no-store'})
	if (!res.ok) {
		throw new Error('Failed to fetch product by handle')
	}

	const data = await res.json() as ListProductsResponse
	return data.products[0] ?? null
}

export {getProductByHandle, listProducts}
export type {MedusaProduct, ListProductsResponse}
