import {
	Controller,
	Get,
	Headers,
	Query,
	UnauthorizedException,
} from '@nestjs/common'
import {OrdersService} from '../../orders/orders.service'
import {CustomerAuthService} from '../customer-auth.service'

@Controller('store/orders')
export class StoreOrdersController {
	constructor(
		private readonly customerAuthService: CustomerAuthService,
		private readonly ordersService: OrdersService,
	) {}

	@Get()
	async listOrders(
		@Headers('authorization') authorization: string | undefined,
		@Query() query: {limit?: number, offset?: number},
	) {
		const customer = await this.customerAuthService.getCustomerByToken(
			this.extractBearerToken(authorization),
		)

		return this.ordersService.listOrdersForCustomer(customer.id, query)
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
