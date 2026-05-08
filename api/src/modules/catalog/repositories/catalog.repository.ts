import {CatalogProduct} from '../types/catalog-product.types'
import {UpsertProductDto} from '../dto/upsert-product.dto'

type ListCatalogProductsParams = {
	query?: string,
	handle?: string,
}

abstract class CatalogRepository {
	abstract listProducts(params?: ListCatalogProductsParams): Promise<CatalogProduct[]>

	abstract getProductById(id: string): Promise<CatalogProduct | null>

	abstract getProductByHandle(handle: string): Promise<CatalogProduct | null>

	abstract createProduct(input: UpsertProductDto): Promise<CatalogProduct>

	abstract updateProduct(id: string, input: UpsertProductDto): Promise<CatalogProduct | null>

	abstract deleteProduct(id: string): Promise<boolean>
}

export {
	CatalogRepository,
}
export type {
	ListCatalogProductsParams,
}
