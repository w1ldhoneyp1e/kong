import {
	Body,
	Controller,
	Delete,
	Get,
	Headers,
	HttpCode,
	Param,
	Put,
	Query,
	UnauthorizedException,
} from '@nestjs/common'
import {ListOrdersQueryDto} from './dto/list-orders-query.dto'
import {UpdateOrderDto} from './dto/update-order.dto'
import {OrdersService} from './orders.service'

@Controller('orders')
export class OrdersController {
	constructor(
		private readonly ordersService: OrdersService,
	) {}

	@Get()
	listOrders(
		@Headers('authorization') authorization: string | undefined,
		@Query() query: ListOrdersQueryDto,
	) {
		return this.ordersService.listOrders(this.extractBearerToken(authorization), query)
	}

	@Get(':id')
	getOrder(
		@Headers('authorization') authorization: string | undefined,
		@Param('id') id: string,
	) {
		return this.ordersService.getOrder(this.extractBearerToken(authorization), id)
	}

	@Put(':id')
	updateOrder(
		@Headers('authorization') authorization: string | undefined,
		@Param('id') id: string,
		@Body() input: UpdateOrderDto,
	) {
		return this.ordersService.updateOrder(this.extractBearerToken(authorization), id, input)
	}

	@Delete(':id')
	@HttpCode(204)
	async deleteOrder(
		@Headers('authorization') authorization: string | undefined,
		@Param('id') id: string,
	): Promise<void> {
		await this.ordersService.deleteOrder(this.extractBearerToken(authorization), id)
	}

	private extractBearerToken(authorization?: string): string {
		if (!authorization) {
			throw new UnauthorizedException('Не задан Authorization header')
		}

		const [type, token] = authorization.split(' ')
		if (type?.toLowerCase() !== 'bearer' || !token) {
			throw new UnauthorizedException('Некорректный Authorization header')
		}

		return token
	}
}
