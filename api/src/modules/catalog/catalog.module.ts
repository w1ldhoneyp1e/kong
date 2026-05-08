import {Module} from '@nestjs/common'
import {AdminProductsController} from './controllers/admin-products.controller'
import {CategoriesController} from './controllers/categories.controller'
import {StoreProductsController} from './controllers/store-products.controller'
import {CategoryRepository} from './repositories/category.repository'
import {CatalogRepository} from './repositories/catalog.repository'
import {FileCategoryRepository} from './repositories/file-category.repository'
import {FileCatalogRepository} from './repositories/file-catalog.repository'
import {CategoryService} from './services/category.service'
import {CatalogService} from './services/catalog.service'

@Module({
	controllers: [
		AdminProductsController,
		CategoriesController,
		StoreProductsController,
	],
	providers: [
		CategoryService,
		CatalogService,
		{
			provide: CategoryRepository,
			useClass: FileCategoryRepository,
		},
		{
			provide: CatalogRepository,
			useClass: FileCatalogRepository,
		},
	],
})
export class CatalogModule {}
