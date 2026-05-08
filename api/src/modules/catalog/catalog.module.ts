import {Module} from '@nestjs/common'
import {AdminProductsController} from './controllers/admin-products.controller'
import {StoreProductsController} from './controllers/store-products.controller'
import {CatalogService} from './services/catalog.service'

@Module({
	controllers: [
		AdminProductsController,
		StoreProductsController,
	],
	providers: [CatalogService],
})
export class CatalogModule {}
