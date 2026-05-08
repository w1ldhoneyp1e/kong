import {Controller, Get} from '@nestjs/common'
import {ProductTagService} from '../services/product-tag.service'

@Controller('product-tags')
export class ProductTagsController {
	constructor(
		private readonly productTagService: ProductTagService,
	) {}

	@Get()
	listTags() {
		return this.productTagService.listTags()
	}
}
