import {Injectable} from '@nestjs/common'
import {ListProductsQueryDto} from '../dto/list-products-query.dto'
import {StoreListProductsQueryDto} from '../dto/store-list-products-query.dto'
import {UpsertProductDto} from '../dto/upsert-product.dto'
import {CatalogProduct} from '../types/catalog-product.types'

const DEMO_PRODUCTS: CatalogProduct[] = [
	{
		id: 'prod_demo_belay_device',
		title: 'Belay Device Alpine',
		subtitle: 'Migration fixture',
		handle: 'belay-device-alpine',
		description: 'Temporary catalog record while NestJS backend is being migrated.',
		status: 'published',
		thumbnail: null,
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
			},
		],
	},
]

@Injectable()
export class CatalogService {
	listAdminProducts(query: ListProductsQueryDto): {products: CatalogProduct[]} {
		const products = this.filterProducts(query.q)
		return {products}
	}

	getAdminProduct(id: string): {product: CatalogProduct | null} {
		const product = DEMO_PRODUCTS.find(item => item.id === id) ?? null
		return {product}
	}

	createAdminProduct(input: UpsertProductDto): {message: string, payload: UpsertProductDto} {
		return {
			message: 'Catalog write migration is not implemented yet',
			payload: input,
		}
	}

	updateAdminProduct(id: string, input: UpsertProductDto): {message: string, id: string, payload: UpsertProductDto} {
		return {
			message: 'Catalog write migration is not implemented yet',
			id,
			payload: input,
		}
	}

	deleteAdminProduct(id: string): {message: string, id: string} {
		return {
			message: 'Catalog delete migration is not implemented yet',
			id,
		}
	}

	listStoreProducts(query: StoreListProductsQueryDto): {products: CatalogProduct[], count: number} {
		let products = DEMO_PRODUCTS
		if (query.handle) {
			products = products.filter(item => item.handle === query.handle)
		}
		if (query.q) {
			products = this.filterProducts(query.q)
		}

		return {
			products,
			count: products.length,
		}
	}

	getStoreProductByHandle(handle: string): {product: CatalogProduct | null} {
		const product = DEMO_PRODUCTS.find(item => item.handle === handle) ?? null
		return {product}
	}

	private filterProducts(query?: string): CatalogProduct[] {
		if (!query) {
			return DEMO_PRODUCTS
		}

		const normalized = query.trim().toLowerCase()
		return DEMO_PRODUCTS.filter(product =>
			product.title.toLowerCase().includes(normalized)
			|| product.handle.toLowerCase().includes(normalized),
		)
	}
}
