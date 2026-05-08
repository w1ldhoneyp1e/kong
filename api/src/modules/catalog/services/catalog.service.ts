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

	async listStoreProducts(query: StoreListProductsQueryDto): Promise<{products: CatalogProduct[], count: number}> {
		const products = await this.catalogRepository.listProducts({
			handle: query.handle,
			query: query.q,
		})
		return {
			products,
			count: products.length,
		}
	}

	async getStoreProductByHandle(handle: string): Promise<{product: CatalogProduct | null}> {
		const product = await this.catalogRepository.getProductByHandle(handle)
		return {product}
	}
}
