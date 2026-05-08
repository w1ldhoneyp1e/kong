import {CatalogProduct} from '../types/catalog-product.types'

type ListCatalogProductsParams = {
	query?: string,
	handle?: string,
}

abstract class CatalogRepository {
	abstract listProducts(params?: ListCatalogProductsParams): Promise<CatalogProduct[]>

	abstract getProductById(id: string): Promise<CatalogProduct | null>

	abstract getProductByHandle(handle: string): Promise<CatalogProduct | null>
}

export {
	CatalogRepository,
}
export type {
	ListCatalogProductsParams,
}
