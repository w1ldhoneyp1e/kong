import {Injectable} from '@nestjs/common'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {UpsertTagDto} from '../dto/upsert-tag.dto'
import {CatalogTag} from '../types/tag.types'
import {TagRepository} from './tag.repository'

function resolveApiDataPath(fileName: string): string {
	const cwd = process.cwd()
	const apiRoot = path.basename(cwd) === 'api'
		? cwd
		: path.resolve(cwd, 'api')
	return path.resolve(apiRoot, 'data', fileName)
}

const TAGS_FILE_PATH = resolveApiDataPath('catalog-tags.json')

type TagStore = {
	tags: CatalogTag[],
}

const DEFAULT_TAGS: CatalogTag[] = [
	{
		id: 'tag_popular',
		value: 'Популярное',
		color: '#2563eb',
	},
]

@Injectable()
export class FileTagRepository extends TagRepository {
	private static writeQueue = Promise.resolve()

	async listTags(): Promise<CatalogTag[]> {
		const store = await this.readStore()
		return [...store.tags].sort((a, b) =>
			(a.value ?? '').localeCompare(b.value ?? '', 'ru'),
		)
	}

	async getTagById(id: string): Promise<CatalogTag | null> {
		const store = await this.readStore()
		return store.tags.find(tag => tag.id === id) ?? null
	}

	async getTagByValue(value: string): Promise<CatalogTag | null> {
		const normalized = value.trim().toLowerCase()
		const store = await this.readStore()
		return store.tags.find(tag => (tag.value ?? '').trim().toLowerCase() === normalized) ?? null
	}

	async createTag(input: UpsertTagDto): Promise<CatalogTag> {
		return this.mutateStore(store => {
			const tag = this.mapDtoToTag(input, {
				id: this.createId(),
			})

			store.tags.push(tag)
			return {
				nextStore: store,
				result: tag,
			}
		})
	}

	async updateTag(id: string, input: UpsertTagDto): Promise<CatalogTag | null> {
		return this.mutateStore(store => {
			const index = store.tags.findIndex(tag => tag.id === id)
			if (index < 0) {
				return {
					nextStore: store,
					result: null,
				}
			}

			const existing = store.tags[index]
			if (!existing) {
				return {
					nextStore: store,
					result: null,
				}
			}

			const updated = this.mapDtoToTag(input, {id: existing.id})
			store.tags[index] = updated
			return {
				nextStore: store,
				result: updated,
			}
		})
	}

	async deleteTag(id: string): Promise<boolean> {
		return this.mutateStore(store => {
			const nextTags = store.tags.filter(tag => tag.id !== id)
			if (nextTags.length === store.tags.length) {
				return {
					nextStore: store,
					result: false,
				}
			}

			return {
				nextStore: {tags: nextTags},
				result: true,
			}
		})
	}

	private async readStore(): Promise<TagStore> {
		try {
			const content = await readFile(TAGS_FILE_PATH, 'utf8')
			const parsed = JSON.parse(content) as TagStore
			return Array.isArray(parsed.tags)
				? parsed
				: {tags: DEFAULT_TAGS}
		}
		catch {
			return {tags: DEFAULT_TAGS}
		}
	}

	private async writeStore(store: TagStore): Promise<void> {
		await mkdir(path.dirname(TAGS_FILE_PATH), {recursive: true})
		await writeFile(TAGS_FILE_PATH, `${JSON.stringify(store, null, 2)}\n`, 'utf8')
	}

	private async mutateStore<T>(mutator: (store: TagStore) => {
		nextStore: TagStore,
		result: T,
	}): Promise<T> {
		const operation = FileTagRepository.writeQueue.then(async () => {
			const store = await this.readStore()
			const {nextStore, result} = mutator(store)
			await this.writeStore(nextStore)
			return result
		})
		FileTagRepository.writeQueue = operation.then(() => undefined, () => undefined)
		return operation
	}

	private mapDtoToTag(
		input: UpsertTagDto,
		params: {id: string},
	): CatalogTag {
		return {
			id: params.id,
			value: input.value.trim(),
			color: input.color?.trim() || '#334155',
		}
	}

	private createId(): string {
		return `tag_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
	}
}
