import {Inject, Injectable, NotFoundException} from '@nestjs/common'
import {Cart} from '../carts/types/cart.types'
import {CompleteCartDto} from '../carts/dto/complete-cart.dto'
import {StaffService} from '../staff/staff.service'
import {ListOrdersQueryDto} from './dto/list-orders-query.dto'
import {UpdateOrderDto} from './dto/update-order.dto'
import {OrderRepository} from './repositories/order.repository'

@Injectable()
export class OrdersService {
	constructor(
		private readonly staffService: StaffService,
		@Inject(OrderRepository)
		private readonly orderRepository: OrderRepository,
	) {}

	async listOrders(token: string, query?: ListOrdersQueryDto) {
		await this.staffService.requirePermission(token, 'orders:manage')
		const [orders, count] = await Promise.all([
			this.orderRepository.listOrders(query),
			this.orderRepository.countOrders(query),
		])
		return {
			orders,
			count,
		}
	}

	async getOrder(token: string, id: string) {
		await this.staffService.requirePermission(token, 'orders:manage')
		const order = await this.orderRepository.getOrderById(id)
		if (!order) {
			throw new NotFoundException('Заказ не найден')
		}

		return {order}
	}

	async createOrderFromCart(
		cart: Cart,
		customer?: {
			id: string,
			email: string | null,
		},
		checkout?: CompleteCartDto,
	) {
		return this.orderRepository.createOrderFromCart(cart, customer, checkout)
	}

	async updateOrder(token: string, id: string, input: UpdateOrderDto) {
		await this.staffService.requirePermission(token, 'orders:manage')
		const order = await this.orderRepository.updateOrder(id, input)
		if (!order) {
			throw new NotFoundException('Заказ не найден')
		}

		return {order}
	}

	async deleteOrder(token: string, id: string): Promise<void> {
		await this.staffService.requirePermission(token, 'orders:manage')
		const deleted = await this.orderRepository.deleteOrder(id)
		if (!deleted) {
			throw new NotFoundException('Заказ не найден')
		}
	}

	async listOrdersByCustomerId(
		token: string,
		customerId: string,
		query?: {
			limit?: number,
			offset?: number,
		},
	) {
		await this.staffService.requirePermission(token, 'customers:manage')
		return this.orderRepository.listOrdersByCustomerId(customerId, query)
	}

	async listOrdersForCustomer(
		customerId: string,
		query?: {
			limit?: number,
			offset?: number,
		},
	) {
		return this.orderRepository.listOrdersByCustomerId(customerId, query)
	}
}
