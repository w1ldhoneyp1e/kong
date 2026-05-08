import {UpsertCategoryDto} from '../dto/upsert-category.dto'
import {CatalogCategory} from '../types/category.types'

abstract class CategoryRepository {
	abstract listCategories(): Promise<CatalogCategory[]>

	abstract getCategoryById(id: string): Promise<CatalogCategory | null>

	abstract getCategoryBySlug(slug: string): Promise<CatalogCategory | null>

	abstract createCategory(input: UpsertCategoryDto): Promise<CatalogCategory>

	abstract updateCategory(id: string, input: UpsertCategoryDto): Promise<CatalogCategory | null>

	abstract deleteCategory(id: string): Promise<{deleted: boolean, hasChildren: boolean}>
}

export {
	CategoryRepository,
}
