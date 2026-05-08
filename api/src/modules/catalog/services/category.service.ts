import {ConflictException, Inject, Injectable} from '@nestjs/common'
import {UpsertCategoryDto} from '../dto/upsert-category.dto'
import {CategoryRepository} from '../repositories/category.repository'
import {CatalogCategory} from '../types/category.types'

@Injectable()
export class CategoryService {
	constructor(
		@Inject(CategoryRepository)
		private readonly categoryRepository: CategoryRepository,
	) {}

	async listCategories(): Promise<{categories: CatalogCategory[]}> {
		const categories = await this.categoryRepository.listCategories()
		return {categories}
	}

	async getCategory(id: string): Promise<{category: CatalogCategory | null}> {
		const category = await this.categoryRepository.getCategoryById(id)
		return {category}
	}

	async createCategory(input: UpsertCategoryDto): Promise<{category: CatalogCategory}> {
		const existing = await this.categoryRepository.getCategoryBySlug(input.slug)
		if (existing) {
			throw new ConflictException('Категория с таким URL уже существует')
		}

		const category = await this.categoryRepository.createCategory(input)
		return {category}
	}

	async updateCategory(id: string, input: UpsertCategoryDto): Promise<{category: CatalogCategory | null}> {
		const existing = await this.categoryRepository.getCategoryBySlug(input.slug)
		if (existing && existing.id !== id) {
			throw new ConflictException('Категория с таким URL уже существует')
		}

		const category = await this.categoryRepository.updateCategory(id, input)
		return {category}
	}

	async deleteCategory(id: string): Promise<{deleted: boolean, hasChildren: boolean}> {
		return this.categoryRepository.deleteCategory(id)
	}
}
