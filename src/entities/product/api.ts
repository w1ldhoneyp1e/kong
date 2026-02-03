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
}

type ListProductsResponse = {
	products: MedusaProduct[],
	count: number,
}

async function listProducts(params: {
	q?: string,
	limit?: number,
	offset?: number,
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

export {listProducts}
export type {MedusaProduct, ListProductsResponse}
