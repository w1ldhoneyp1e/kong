import {Controller, Get, Param, Query} from '@nestjs/common'
import {CatalogService} from '../services/catalog.service'
import {StoreListProductsQueryDto} from '../dto/store-list-products-query.dto'

@Controller('store/products')
export class StoreProductsController {
	constructor(
		private readonly catalogService: CatalogService,
	) {}

	@Get()
	listProducts(
		@Query() query: StoreListProductsQueryDto,
	) {
		return this.catalogService.listStoreProducts(query)
	}

	@Get(':handle')
	getProductByHandle(
		@Param('handle') handle: string,
	) {
		return this.catalogService.getStoreProductByHandle(handle)
	}
}
