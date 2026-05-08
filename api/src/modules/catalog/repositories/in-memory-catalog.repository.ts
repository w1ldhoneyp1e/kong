import {Injectable} from '@nestjs/common'
import {
	CatalogRepository,
	type ListCatalogProductsParams,
} from './catalog.repository'
import {CatalogProduct} from '../types/catalog-product.types'

const PRODUCTS: CatalogProduct[] = [
	{
		id: 'prod_demo_belay_device',
		title: 'Belay Device Alpine',
		subtitle: 'Migration fixture',
		handle: 'belay-device-alpine',
		description: 'Temporary catalog record while NestJS backend is being migrated.',
		status: 'published',
		thumbnail: null,
		created_at: '2026-05-08T00:00:00.000Z',
		updated_at: '2026-05-08T00:00:00.000Z',
		material: 'Aluminum',
		weight: 87,
		length: null,
		width: null,
		height: null,
		metadata: {
			documents: [],
		},
		images: [],
		options: [],
		tags: [
			{
				id: 'tag_demo_popular',
				value: 'popular',
			},
		],
		categories: [
			{
				id: 'cat_demo_hardware',
				name: 'Hardware',
			},
		],
		variants: [
			{
				id: 'variant_demo_belay_device',
				title: 'Default',
				sku: 'ALPINE-BELAY-01',
				available: true,
				prices: [
					{
						amount: 7900,
						currency_code: 'rub',
					},
				],
				metadata: {
					available: true,
				},
			},
		],
	},
]

@Injectable()
export class InMemoryCatalogRepository extends CatalogRepository {
	async listProducts(params?: ListCatalogProductsParams): Promise<CatalogProduct[]> {
		const handle = params?.handle?.trim().toLowerCase()
		const query = params?.query?.trim().toLowerCase()

		return PRODUCTS.filter(product => {
			if (handle && product.handle.toLowerCase() !== handle) {
				return false
			}

			if (!query) {
				return true
			}

			return product.title.toLowerCase().includes(query)
				|| product.handle.toLowerCase().includes(query)
		})
	}

	async getProductById(id: string): Promise<CatalogProduct | null> {
		return PRODUCTS.find(product => product.id === id) ?? null
	}

	async getProductByHandle(handle: string): Promise<CatalogProduct | null> {
		const normalized = handle.trim().toLowerCase()
		return PRODUCTS.find(product => product.handle.toLowerCase() === normalized) ?? null
	}
}
