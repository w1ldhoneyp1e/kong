import {
	Body,
	Controller,
	Delete,
	Get,
	Headers,
	HttpCode,
	Param,
	Post,
	Query,
} from '@nestjs/common'
import {CartLineItemDto} from '../dto/cart-line-item.dto'
import {CompleteCartDto} from '../dto/complete-cart.dto'
import {CreateCartDto} from '../dto/create-cart.dto'
import {CartsService} from '../carts.service'

@Controller('store/carts')
export class StoreCartsController {
	constructor(
		private readonly cartsService: CartsService,
	) {}

	@Post()
	createCart(@Body() input: CreateCartDto) {
		return this.cartsService.createCart(input)
	}

	@Get(':id')
	getCart(@Param('id') id: string) {
		return this.cartsService.getCart(id)
	}

	@Delete(':id')
	@HttpCode(204)
	async deleteCart(@Param('id') id: string): Promise<void> {
		await this.cartsService.deleteCart(id)
	}

	@Post(':id/line-items')
	addLineItem(
		@Param('id') id: string,
		@Body() input: CartLineItemDto,
	) {
		return this.cartsService.addLineItem(id, input)
	}

	@Post(':id/line-items/:lineId')
	updateLineItem(
		@Param('id') id: string,
		@Param('lineId') lineId: string,
		@Body() input: CartLineItemDto,
	) {
		return this.cartsService.updateLineItem(id, lineId, input)
	}

	@Delete(':id/line-items/:lineId')
	removeLineItem(
		@Param('id') id: string,
		@Param('lineId') lineId: string,
	) {
		return this.cartsService.removeLineItem(id, lineId)
	}

	@Post(':id/complete')
	completeCart(
		@Param('id') id: string,
		@Headers('authorization') authorization: string | undefined,
		@Body() input: CompleteCartDto,
		@Query() _query: Record<string, unknown>,
	) {
		return this.cartsService.completeCart(id, input, authorization)
	}
}
