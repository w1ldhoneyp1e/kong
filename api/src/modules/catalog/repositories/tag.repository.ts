import {UpsertTagDto} from '../dto/upsert-tag.dto'
import {CatalogTag} from '../types/tag.types'

export abstract class TagRepository {
	abstract listTags(): Promise<CatalogTag[]>
	abstract getTagById(id: string): Promise<CatalogTag | null>
	abstract getTagByValue(value: string): Promise<CatalogTag | null>
	abstract createTag(input: UpsertTagDto): Promise<CatalogTag>
	abstract updateTag(id: string, input: UpsertTagDto): Promise<CatalogTag | null>
	abstract deleteTag(id: string): Promise<boolean>
}
