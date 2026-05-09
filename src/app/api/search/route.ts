import {getBackendUrl, getCatalogBackendUrl} from '../../../shared'

type SearchProduct = {
	id: string,
	title?: string | null,
	description?: string | null,
	handle?: string | null,
}

type SearchCategory = {
	id: string,
	name: string,
	slug: string,
}

type SearchPage = {
	id: string,
	slug: string,
	title: string,
	description: string | null,
	body: string,
}

type SearchResultItem =
	| {
		type: 'product',
		id: string,
		title: string,
		description: string | null,
		href: string,
		score: number,
	}
	| {
		type: 'category',
		id: string,
		title: string,
		description: string | null,
		href: string,
		score: number,
	}
	| {
		type: 'page',
		id: string,
		title: string,
		description: string | null,
		href: string,
		score: number,
	}

function normalize(value: string): string {
	return value.trim().toLowerCase()
}

function scoreTextMatch(query: string, ...fields: Array<string | null | undefined>): number {
	let score = 0
	for (const field of fields) {
		const value = normalize(field ?? '')
		if (!value) {
			continue
		}

		if (value === query) {
			score = Math.max(score, 120)
			continue
		}

		if (value.startsWith(query)) {
			score = Math.max(score, 90)
			continue
		}

		if (value.includes(query)) {
			score = Math.max(score, 60)
		}
	}

	return score
}

async function fetchProducts(query: string): Promise<SearchResultItem[]> {
	const params = new URLSearchParams({
		q: query,
		limit: '12',
	})
	const res = await fetch(`${getCatalogBackendUrl()}/store/products?${params}`, {
		cache: 'no-store',
	})
	if (!res.ok) {
		return []
	}

	const data = (await res.json().catch(() => ({}))) as {products?: SearchProduct[]}
	return (data.products ?? [])
		.map(product => {
			const title = product.title?.trim() || 'Товар'
			return {
				type: 'product' as const,
				id: product.id,
				title,
				description: product.description ?? null,
				href: product.handle
					? `/product/${product.handle}`
					: '/catalog',
				score: scoreTextMatch(query, title, product.description, product.handle),
			}
		})
		.filter(item => item.score > 0)
}

async function fetchCategories(query: string): Promise<SearchResultItem[]> {
	const res = await fetch(`${getCatalogBackendUrl()}/categories`, {
		cache: 'no-store',
	})
	if (!res.ok) {
		return []
	}

	const data = (await res.json().catch(() => ({}))) as {categories?: SearchCategory[]}
	return (data.categories ?? [])
		.map(category => ({
			type: 'category' as const,
			id: category.id,
			title: category.name,
			description: 'Категория каталога',
			href: `/catalog/${category.slug}`,
			score: scoreTextMatch(query, category.name, category.slug),
		}))
		.filter(item => item.score > 0)
}

async function fetchPages(query: string): Promise<SearchResultItem[]> {
	const res = await fetch(`${getBackendUrl()}/pages`, {
		cache: 'no-store',
	})
	if (!res.ok) {
		return []
	}

	const data = (await res.json().catch(() => ({}))) as {pages?: SearchPage[]}
	return (data.pages ?? [])
		.map(page => ({
			type: 'page' as const,
			id: page.id,
			title: page.title,
			description: page.description ?? null,
			href: page.slug === 'about'
				? '/about'
				: page.slug === 'contacts'
					? '/contacts'
					: `/${page.slug}`,
			score: scoreTextMatch(query, page.title, page.description, page.body),
		}))
		.filter(item => item.score > 0)
}

export async function GET(request: Request) {
	const {searchParams} = new URL(request.url)
	const q = normalize(searchParams.get('q') ?? '')
	const limit = Math.max(1, Math.min(20, Number(searchParams.get('limit') ?? '10') || 10))

	if (!q) {
		return Response.json({
			query: '',
			results: [],
		})
	}

	const [products, categories, pages] = await Promise.all([
		fetchProducts(q),
		fetchCategories(q),
		fetchPages(q),
	])

	const results = [...products, ...categories, ...pages]
		.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'ru'))
		.slice(0, limit)

	return Response.json({
		query: q,
		results,
	})
}
