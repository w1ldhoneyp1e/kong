import {
	ConflictException,
	Inject,
	Injectable,
} from '@nestjs/common'
import {UpsertTagDto} from '../dto/upsert-tag.dto'
import {CatalogRepository} from '../repositories/catalog.repository'
import {TagRepository} from '../repositories/tag.repository'
import {CatalogTag} from '../types/tag.types'

@Injectable()
export class TagService {
	constructor(
		@Inject(CatalogRepository)
		private readonly catalogRepository: CatalogRepository,
		@Inject(TagRepository)
		private readonly tagRepository: TagRepository,
	) {}

	async listTags(): Promise<{tags: CatalogTag[]}> {
		const tags = await this.tagRepository.listTags()
		const products = await this.catalogRepository.listProducts()
		const merged = new Map<string, CatalogTag>()

		for (const tag of tags) {
			merged.set(tag.id, tag)
		}

		for (const product of products) {
			for (const tag of product.tags ?? []) {
				const id = tag.id?.trim()
				const value = tag.value?.trim()
				if (!id || !value || merged.has(id)) {
					continue
				}

				merged.set(id, {
					id,
					value,
					color: tag.color ?? '#334155',
				})
			}
		}

		return {
			tags: [...merged.values()].sort((a, b) =>
				(a.value ?? '').localeCompare(b.value ?? '', 'ru'),
			),
		}
	}

	async createTag(input: UpsertTagDto): Promise<{tag: CatalogTag}> {
		const existing = await this.tagRepository.getTagByValue(input.value)
		if (existing) {
			throw new ConflictException('Тег с таким названием уже существует')
		}

		const tag = await this.tagRepository.createTag(input)
		return {tag}
	}

	async updateTag(id: string, input: UpsertTagDto): Promise<{tag: CatalogTag | null}> {
		const existing = await this.tagRepository.getTagByValue(input.value)
		if (existing && existing.id !== id) {
			throw new ConflictException('Тег с таким названием уже существует')
		}

		const tag = await this.tagRepository.updateTag(id, input)
		return {tag}
	}

	async deleteTag(id: string): Promise<{deleted: boolean}> {
		const deleted = await this.tagRepository.deleteTag(id)
		return {deleted}
	}
}
