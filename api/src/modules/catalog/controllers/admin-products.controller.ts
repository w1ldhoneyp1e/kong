import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
} from '@nestjs/common'
import {CatalogService} from '../services/catalog.service'
import {ListProductsQueryDto} from '../dto/list-products-query.dto'
import {UpsertProductDto} from '../dto/upsert-product.dto'

@Controller('products')
export class AdminProductsController {
	constructor(
		private readonly catalogService: CatalogService,
	) {}

	@Get()
	listProducts(
		@Query() query: ListProductsQueryDto,
	) {
		return this.catalogService.listAdminProducts(query)
	}

	@Get(':id')
	getProduct(
		@Param('id') id: string,
	) {
		return this.catalogService.getAdminProduct(id)
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	createProduct(
		@Body() input: UpsertProductDto,
	) {
		return this.catalogService.createAdminProduct(input)
	}

	@Put(':id')
	updateProduct(
		@Param('id') id: string,
		@Body() input: UpsertProductDto,
	) {
		return this.catalogService.updateAdminProduct(id, input)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	deleteProduct(
		@Param('id') id: string,
	) {
		return this.catalogService.deleteAdminProduct(id)
	}
}
