import {Injectable} from '@nestjs/common'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {UpsertCategoryDto} from '../dto/upsert-category.dto'
import {CatalogCategory} from '../types/category.types'
import {CategoryRepository} from './category.repository'

function resolveApiDataPath(fileName: string): string {
	const cwd = process.cwd()
	const apiRoot = path.basename(cwd) === 'api'
		? cwd
		: path.resolve(cwd, 'api')
	return path.resolve(apiRoot, 'data', fileName)
}

const CATEGORIES_FILE_PATH = resolveApiDataPath('catalog-categories.json')

type CategoryStore = {
	categories: CatalogCategory[],
}

@Injectable()
export class FileCategoryRepository extends CategoryRepository {
	private static writeQueue = Promise.resolve()

	async listCategories(): Promise<CatalogCategory[]> {
		const store = await this.readStore()
		return [...store.categories].sort((a, b) => a.name.localeCompare(b.name, 'ru'))
	}

	async getCategoryById(id: string): Promise<CatalogCategory | null> {
		const store = await this.readStore()
		return store.categories.find(category => category.id === id) ?? null
	}

	async getCategoryBySlug(slug: string): Promise<CatalogCategory | null> {
		const normalized = slug.trim().toLowerCase()
		const store = await this.readStore()
		return store.categories.find(category => category.slug.toLowerCase() === normalized) ?? null
	}

	async createCategory(input: UpsertCategoryDto): Promise<CatalogCategory> {
		return this.mutateStore(store => {
			const category = this.mapDtoToCategory(input, {
				id: this.createId(),
			})

			store.categories.push(category)
			return {
				nextStore: store,
				result: category,
			}
		})
	}

	async updateCategory(id: string, input: UpsertCategoryDto): Promise<CatalogCategory | null> {
		return this.mutateStore(store => {
			const index = store.categories.findIndex(category => category.id === id)
			if (index < 0) {
				return {
					nextStore: store,
					result: null,
				}
			}

			const existing = store.categories[index]
			if (!existing) {
				return {
					nextStore: store,
					result: null,
				}
			}

			const updated = this.mapDtoToCategory(input, {
				id: existing.id,
			})
			store.categories[index] = updated
			return {
				nextStore: store,
				result: updated,
			}
		})
	}

	async deleteCategory(id: string): Promise<{deleted: boolean, hasChildren: boolean}> {
		return this.mutateStore<{deleted: boolean, hasChildren: boolean}>(store => {
			const hasChildren = store.categories.some(category => category.parentId === id)
			if (hasChildren) {
				return {
					nextStore: store,
					result: {
						deleted: false,
						hasChildren: true,
					},
				}
			}

			const nextCategories = store.categories.filter(category => category.id !== id)
			if (nextCategories.length === store.categories.length) {
				return {
					nextStore: store,
					result: {
						deleted: false,
						hasChildren: false,
					},
				}
			}

			return {
				nextStore: {
					categories: nextCategories,
				},
				result: {
					deleted: true,
					hasChildren: false,
				},
			}
		})
	}

	private async readStore(): Promise<CategoryStore> {
		try {
			const content = await readFile(CATEGORIES_FILE_PATH, 'utf8')
			const parsed = JSON.parse(content) as CategoryStore

			return Array.isArray(parsed.categories)
				? parsed
				: {categories: []}
		}
		catch {
			return {categories: []}
		}
	}

	private async writeStore(store: CategoryStore): Promise<void> {
		await mkdir(path.dirname(CATEGORIES_FILE_PATH), {recursive: true})
		await writeFile(CATEGORIES_FILE_PATH, `${JSON.stringify(store, null, 2)}\n`, 'utf8')
	}

	private async mutateStore<T>(mutator: (store: CategoryStore) => {
		nextStore: CategoryStore,
		result: T,
	}): Promise<T> {
		const operation = FileCategoryRepository.writeQueue.then(async () => {
			const store = await this.readStore()
			const {
				nextStore, result,
			} = mutator(store)
			await this.writeStore(nextStore)
			return result
		})
		FileCategoryRepository.writeQueue = operation.then(() => undefined, () => undefined)
		return operation
	}

	private mapDtoToCategory(
		input: UpsertCategoryDto,
		params: {
			id: string,
		},
	): CatalogCategory {
		return {
			id: params.id,
			name: input.name.trim(),
			slug: input.slug.trim().toLowerCase(),
			parentId: input.parentId ?? null,
		}
	}

	private createId(): string {
		return `cat_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
	}
}
