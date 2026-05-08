import {Injectable} from '@nestjs/common'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {UpsertProductDto} from '../dto/upsert-product.dto'
import {
	CatalogRepository,
	type ListCatalogProductsParams,
} from './catalog.repository'
import {CatalogProduct} from '../types/catalog-product.types'

const CATALOG_FILE_PATH = path.resolve(process.cwd(), 'data/catalog-products.json')

type CatalogStore = {
	products: CatalogProduct[],
}

@Injectable()
export class FileCatalogRepository extends CatalogRepository {
	private static writeQueue = Promise.resolve()

	async listProducts(params?: ListCatalogProductsParams): Promise<CatalogProduct[]> {
		const filtered = await this.filterProducts(params)
		const ordered = this.applyOrder(filtered, params?.order)
		const offset = params?.offset ?? 0
		const limit = params?.limit

		return limit === undefined
			? ordered.slice(offset)
			: ordered.slice(offset, offset + limit)
	}

	async countProducts(params?: ListCatalogProductsParams): Promise<number> {
		const filtered = await this.filterProducts(params)
		return filtered.length
	}

	async getProductById(id: string): Promise<CatalogProduct | null> {
		const store = await this.readStore()
		return store.products.find(product => product.id === id) ?? null
	}

	async getProductByHandle(handle: string): Promise<CatalogProduct | null> {
		const normalized = handle.trim().toLowerCase()
		const store = await this.readStore()
		return store.products.find(product => product.handle.toLowerCase() === normalized) ?? null
	}

	async createProduct(input: UpsertProductDto): Promise<CatalogProduct> {
		return this.mutateStore(store => {
			const now = new Date().toISOString()
			const product = this.mapDtoToProduct(input, {
				id: this.createId('prod'),
				createdAt: now,
				updatedAt: now,
			})

			store.products.unshift(product)
			return {
				nextStore: store,
				result: product,
			}
		})
	}

	async updateProduct(id: string, input: UpsertProductDto): Promise<CatalogProduct | null> {
		return this.mutateStore(store => {
			const index = store.products.findIndex(product => product.id === id)
			if (index < 0) {
				return {
					nextStore: store,
					result: null,
				}
			}

			const existing = store.products[index]
			if (!existing) {
				return {
					nextStore: store,
					result: null,
				}
			}

			const updated = this.mapDtoToProduct(input, {
				id: existing.id,
				createdAt: existing.created_at ?? new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			})
			store.products[index] = updated
			return {
				nextStore: store,
				result: updated,
			}
		})
	}

	async deleteProduct(id: string): Promise<boolean> {
		return this.mutateStore(store => {
			const nextProducts = store.products.filter(product => product.id !== id)
			if (nextProducts.length === store.products.length) {
				return {
					nextStore: store,
					result: false,
				}
			}

			return {
				nextStore: {
					products: nextProducts,
				},
				result: true,
			}
		})
	}

	private async readStore(): Promise<CatalogStore> {
		try {
			const content = await readFile(CATALOG_FILE_PATH, 'utf8')
			const parsed = JSON.parse(content) as CatalogStore

			return Array.isArray(parsed.products)
				? parsed
				: {products: []}
		}
		catch {
			return {products: []}
		}
	}

	private async writeStore(store: CatalogStore): Promise<void> {
		await mkdir(path.dirname(CATALOG_FILE_PATH), {recursive: true})
		await writeFile(CATALOG_FILE_PATH, `${JSON.stringify(store, null, 2)}\n`, 'utf8')
	}

	private async mutateStore<T>(mutator: (store: CatalogStore) => {
		nextStore: CatalogStore,
		result: T,
	}): Promise<T> {
		const operation = FileCatalogRepository.writeQueue.then(async () => {
			const store = await this.readStore()
			const {
				nextStore, result,
			} = mutator(store)
			await this.writeStore(nextStore)
			return result
		})
		FileCatalogRepository.writeQueue = operation.then(() => undefined, () => undefined)
		return operation
	}

	private async filterProducts(params?: ListCatalogProductsParams): Promise<CatalogProduct[]> {
		const store = await this.readStore()
		const handle = params?.handle?.trim().toLowerCase()
		const query = params?.query?.trim().toLowerCase()
		const categoryId = params?.categoryId?.trim()

		return store.products.filter(product => {
			if (handle && product.handle.toLowerCase() !== handle) {
				return false
			}

			if (categoryId && !(product.category_ids ?? []).includes(categoryId)) {
				return false
			}

			if (!query) {
				return true
			}

			return product.title.toLowerCase().includes(query)
				|| product.handle.toLowerCase().includes(query)
		})
	}

	private mapDtoToProduct(
		input: UpsertProductDto,
		params: {
			id: string,
			createdAt: string,
			updatedAt: string,
		},
	): CatalogProduct {
		const handle = this.normalizeHandle(input.handle ?? input.title)

		return {
			id: params.id,
			title: input.title,
			subtitle: input.subtitle ?? null,
			handle,
			description: input.description ?? null,
			status: this.normalizeStatus(input.status),
			thumbnail: input.thumbnail ?? null,
			created_at: params.createdAt,
			updated_at: params.updatedAt,
			material: input.material ?? null,
			weight: input.weight ?? null,
			length: input.length ?? null,
			width: input.width ?? null,
			height: input.height ?? null,
			metadata: {
				documents: input.metadata?.documents ?? [],
			},
			images: (input.images ?? []).map((image, index) => ({
				id: image.id ?? this.createId('image'),
				url: image.url,
				rank: index,
			})),
			options: [],
			tags: (input.tag_ids ?? []).map(tagId => ({
				id: tagId,
				value: tagId,
			})),
			categories: (input.category_ids ?? []).map(categoryId => ({
				id: categoryId,
				name: categoryId,
			})),
			category_ids: input.category_ids ?? [],
			collection_id: null,
			variants: input.variants.map(variant => ({
				id: variant.id ?? this.createId('variant'),
				title: variant.title,
				sku: variant.sku ?? null,
				available: variant.metadata?.available !== false,
				prices: variant.prices,
				metadata: {
					available: variant.metadata?.available !== false,
					...(variant.metadata ?? {}),
				},
			})),
		}
	}

	private applyOrder(products: CatalogProduct[], order?: string): CatalogProduct[] {
		if (!order) {
			return products
		}

		const next = [...products]
		if (order === 'title') {
			next.sort((a, b) => a.title.localeCompare(b.title, 'ru'))
			return next
		}

		if (order === 'created_at') {
			next.sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
			return next
		}

		return products
	}

	private normalizeHandle(value: string): string {
		return value
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
	}

	private normalizeStatus(value?: string): CatalogProduct['status'] {
		if (value === 'draft' || value === 'published' || value === 'archived') {
			return value
		}

		return 'draft'
	}

	private createId(prefix: string): string {
		return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
	}
}
