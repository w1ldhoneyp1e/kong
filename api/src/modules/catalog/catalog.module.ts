import {Module} from '@nestjs/common'
import {AdminProductsController} from './controllers/admin-products.controller'
import {CategoriesController} from './controllers/categories.controller'
import {ProductTagsController} from './controllers/product-tags.controller'
import {StoreProductsController} from './controllers/store-products.controller'
import {CategoryRepository} from './repositories/category.repository'
import {CatalogRepository} from './repositories/catalog.repository'
import {FileCategoryRepository} from './repositories/file-category.repository'
import {FileCatalogRepository} from './repositories/file-catalog.repository'
import {CategoryService} from './services/category.service'
import {CatalogService} from './services/catalog.service'
import {ProductTagService} from './services/product-tag.service'

@Module({
	controllers: [
		AdminProductsController,
		CategoriesController,
		ProductTagsController,
		StoreProductsController,
	],
	providers: [
		CategoryService,
		CatalogService,
		ProductTagService,
		{
			provide: CategoryRepository,
			useClass: FileCategoryRepository,
		},
		{
			provide: CatalogRepository,
			useClass: FileCatalogRepository,
		},
	],
	exports: [
		CatalogService,
		CatalogRepository,
	],
})
export class CatalogModule {}
