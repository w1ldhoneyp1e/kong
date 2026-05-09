import {Inject, Injectable} from '@nestjs/common'
import {ListProductsQueryDto} from '../dto/list-products-query.dto'
import {StoreListProductsQueryDto} from '../dto/store-list-products-query.dto'
import {UpsertProductDto} from '../dto/upsert-product.dto'
import {CatalogProduct} from '../types/catalog-product.types'
import {CatalogRepository} from '../repositories/catalog.repository'

@Injectable()
export class CatalogService {
	constructor(
		@Inject(CatalogRepository)
		private readonly catalogRepository: CatalogRepository,
	) {}

	async listAdminProducts(query: ListProductsQueryDto): Promise<{products: CatalogProduct[]}> {
		const products = await this.catalogRepository.listProducts({
			query: query.q,
		})
		return {products}
	}

	async getAdminProduct(id: string): Promise<{product: CatalogProduct | null}> {
		const product = await this.catalogRepository.getProductById(id)
		return {product}
	}

	async createAdminProduct(input: UpsertProductDto): Promise<{product: CatalogProduct}> {
		const product = await this.catalogRepository.createProduct(input)
		return {product}
	}

	async updateAdminProduct(id: string, input: UpsertProductDto): Promise<{product: CatalogProduct | null}> {
		const product = await this.catalogRepository.updateProduct(id, input)
		return {product}
	}

	async deleteAdminProduct(id: string): Promise<void> {
		await this.catalogRepository.deleteProduct(id)
	}

	async listStoreProducts(query: StoreListProductsQueryDto): Promise<{products: CatalogProduct[], count: number}> {
		const params = {
			categoryId: query['category_id[]'],
			handle: query.handle,
			order: query.order,
			query: query.q,
		}
		const products = await this.catalogRepository.listProducts(params)
		const publishedProducts = products.filter(product => product.status === 'published')
		const offset = query.offset ?? 0
		const pagedProducts = query.limit === undefined
			? publishedProducts.slice(offset)
			: publishedProducts.slice(offset, offset + query.limit)
		return {
			products: pagedProducts,
			count: publishedProducts.length,
		}
	}

	async getStoreProductByHandle(handle: string): Promise<{product: CatalogProduct | null}> {
		const product = await this.catalogRepository.getProductByHandle(handle)
		return {
			product: product?.status === 'published'
				? product
				: null,
		}
	}
}
