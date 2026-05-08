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
	async listProducts(params?: ListCatalogProductsParams): Promise<CatalogProduct[]> {
		const store = await this.readStore()
		const handle = params?.handle?.trim().toLowerCase()
		const query = params?.query?.trim().toLowerCase()

		return store.products.filter(product => {
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
		const store = await this.readStore()
		return store.products.find(product => product.id === id) ?? null
	}

	async getProductByHandle(handle: string): Promise<CatalogProduct | null> {
		const normalized = handle.trim().toLowerCase()
		const store = await this.readStore()
		return store.products.find(product => product.handle.toLowerCase() === normalized) ?? null
	}

	async createProduct(input: UpsertProductDto): Promise<CatalogProduct> {
		const store = await this.readStore()
		const now = new Date().toISOString()
		const product = this.mapDtoToProduct(input, {
			id: this.createId('prod'),
			createdAt: now,
			updatedAt: now,
		})

		store.products.unshift(product)
		await this.writeStore(store)

		return product
	}

	async updateProduct(id: string, input: UpsertProductDto): Promise<CatalogProduct | null> {
		const store = await this.readStore()
		const index = store.products.findIndex(product => product.id === id)
		if (index < 0) {
			return null
		}

		const existing = store.products[index]
		if (!existing) {
			return null
		}

		const updated = this.mapDtoToProduct(input, {
			id: existing.id,
			createdAt: existing.created_at ?? new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		})
		store.products[index] = updated
		await this.writeStore(store)

		return updated
	}

	async deleteProduct(id: string): Promise<boolean> {
		const store = await this.readStore()
		const nextProducts = store.products.filter(product => product.id !== id)
		if (nextProducts.length === store.products.length) {
			return false
		}

		await this.writeStore({
			products: nextProducts,
		})
		return true
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
			material: null,
			weight: null,
			length: null,
			width: null,
			height: null,
			metadata: {
				documents: [],
			},
			images: [],
			options: [],
			tags: (input.tag_ids ?? []).map(tagId => ({
				id: tagId,
				value: tagId,
			})),
			categories: (input.category_ids ?? []).map(categoryId => ({
				id: categoryId,
				name: categoryId,
			})),
			variants: input.variants.map(variant => ({
				id: variant.id ?? this.createId('variant'),
				title: variant.title,
				sku: variant.sku ?? null,
				available: variant.available,
				prices: variant.prices,
				metadata: {
					available: variant.available,
				},
			})),
		}
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
