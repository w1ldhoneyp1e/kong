import {Inject, Injectable} from '@nestjs/common'
import {ListProductsQueryDto} from '../dto/list-products-query.dto'
import {UpdateProductStockDto} from '../dto/update-product-stock.dto'
import {StoreListProductsQueryDto} from '../dto/store-list-products-query.dto'
import {UpsertProductDto} from '../dto/upsert-product.dto'
import {CatalogProduct} from '../types/catalog-product.types'
import {CatalogRepository} from '../repositories/catalog.repository'
import {TagRepository} from '../repositories/tag.repository'
import {CatalogTag} from '../types/tag.types'

@Injectable()
export class CatalogService {
	constructor(
		@Inject(CatalogRepository)
		private readonly catalogRepository: CatalogRepository,
		@Inject(TagRepository)
		private readonly tagRepository: TagRepository,
	) {}

	async listAdminProducts(query: ListProductsQueryDto): Promise<{products: CatalogProduct[]}> {
		const products = await this.catalogRepository.listProducts({
			query: query.q,
		})
		return {products: await this.hydrateProducts(products)}
	}

	async getAdminProduct(id: string): Promise<{product: CatalogProduct | null}> {
		const product = await this.catalogRepository.getProductById(id)
		return {
			product: product
				? await this.hydrateProduct(product)
				: null,
		}
	}

	async createAdminProduct(input: UpsertProductDto): Promise<{product: CatalogProduct}> {
		const product = await this.catalogRepository.createProduct(input)
		return {product: await this.hydrateProduct(product)}
	}

	async updateAdminProduct(id: string, input: UpsertProductDto): Promise<{product: CatalogProduct | null}> {
		const product = await this.catalogRepository.updateProduct(id, input)
		return {
			product: product
				? await this.hydrateProduct(product)
				: null,
		}
	}

	async deleteAdminProduct(id: string): Promise<void> {
		await this.catalogRepository.deleteProduct(id)
	}

	async updateAdminProductStock(
		id: string,
		input: UpdateProductStockDto,
	): Promise<{product: CatalogProduct | null}> {
		const updated = await this.catalogRepository.updateProductStock(id, input.quantity)

		return {
			product: updated
				? await this.hydrateProduct(updated)
				: null,
		}
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
		const hydratedProducts = await this.hydrateProducts(publishedProducts)
		const offset = query.offset ?? 0
		const pagedProducts = query.limit === undefined
			? hydratedProducts.slice(offset)
			: hydratedProducts.slice(offset, offset + query.limit)
		return {
			products: pagedProducts,
			count: hydratedProducts.length,
		}
	}

	async getStoreProductByHandle(handle: string): Promise<{product: CatalogProduct | null}> {
		const product = await this.catalogRepository.getProductByHandle(handle)
		return {
			product: product?.status === 'published'
				? await this.hydrateProduct(product)
				: null,
		}
	}

	private async hydrateProducts(products: CatalogProduct[]): Promise<CatalogProduct[]> {
		const tags = await this.tagRepository.listTags()
		const tagsById = new Map(tags.map(tag => [tag.id, tag] as const))

		return products.map(product => this.mapProductTags(product, tagsById))
	}

	private async hydrateProduct(product: CatalogProduct): Promise<CatalogProduct> {
		const tags = await this.tagRepository.listTags()
		const tagsById = new Map(tags.map(tag => [tag.id, tag] as const))

		return this.mapProductTags(product, tagsById)
	}

	private mapProductTags(
		product: CatalogProduct,
		tagsById: Map<string, CatalogTag>,
	): CatalogProduct {
		const legacyTagIds = (product.tags ?? [])
			.map(tag => tag.id?.trim())
			.filter((id): id is string => Boolean(id))
		const tagIds = (product.tag_ids ?? legacyTagIds)
			.map(id => id.trim())
			.filter(Boolean)
		const resolvedTags = tagIds
			.map(id => tagsById.get(id) ?? product.tags?.find(tag => tag.id === id) ?? null)
			.filter((tag): tag is CatalogTag => Boolean(tag))

		return {
			...product,
			tag_ids: tagIds,
			tags: resolvedTags,
		}
	}
}
