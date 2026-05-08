import {Module} from '@nestjs/common'
import {AdminProductsController} from './controllers/admin-products.controller'
import {StoreProductsController} from './controllers/store-products.controller'
import {InMemoryCatalogRepository} from './repositories/in-memory-catalog.repository'
import {CatalogRepository} from './repositories/catalog.repository'
import {CatalogService} from './services/catalog.service'

@Module({
	controllers: [
		AdminProductsController,
		StoreProductsController,
	],
	providers: [
		CatalogService,
		{
			provide: CatalogRepository,
			useClass: InMemoryCatalogRepository,
		},
	],
})
export class CatalogModule {}
