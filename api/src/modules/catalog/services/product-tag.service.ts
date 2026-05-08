import {Inject, Injectable} from '@nestjs/common'
import {CatalogRepository} from '../repositories/catalog.repository'
import {CatalogTag} from '../types/tag.types'

@Injectable()
export class ProductTagService {
	constructor(
		@Inject(CatalogRepository)
		private readonly catalogRepository: CatalogRepository,
	) {}

	async listTags(): Promise<{tags: CatalogTag[]}> {
		const products = await this.catalogRepository.listProducts()
		const tags = new Map<string, CatalogTag>()

		for (const product of products) {
			for (const tag of product.tags ?? []) {
				const id = tag.id.trim()
				const value = (tag.value ?? tag.id).trim()
				if (!id || !value) {
					continue
				}

				const key = value.toLowerCase()
				if (!tags.has(key)) {
					tags.set(key, {
						id,
						value,
					})
				}
			}
		}

		return {
			tags: [...tags.values()].sort((a, b) =>
				(a.value ?? '').localeCompare(b.value ?? '', 'ru'),
			),
		}
	}
}
