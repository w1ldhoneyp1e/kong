import {ListOrdersQueryDto} from '../dto/list-orders-query.dto'
import {UpdateOrderDto} from '../dto/update-order.dto'
import {Order} from '../types/order.types'
import {Cart} from '../../carts/types/cart.types'

abstract class OrderRepository {
	abstract listOrders(query?: ListOrdersQueryDto): Promise<Order[]>
	abstract countOrders(query?: ListOrdersQueryDto): Promise<number>
	abstract getOrderById(id: string): Promise<Order | null>
	abstract createOrderFromCart(cart: Cart): Promise<Order>
	abstract updateOrder(id: string, input: UpdateOrderDto): Promise<Order | null>
	abstract deleteOrder(id: string): Promise<boolean>
	abstract listOrdersByCustomerId(
		customerId: string,
		query?: {
			limit?: number,
			offset?: number,
		},
	): Promise<{orders: Order[], count: number}>
}

export {OrderRepository}
