import {Injectable} from '@nestjs/common'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {Cart} from '../../carts/types/cart.types'
import {ListOrdersQueryDto} from '../dto/list-orders-query.dto'
import {UpdateOrderDto} from '../dto/update-order.dto'
import {OrderRepository} from './order.repository'
import {Order} from '../types/order.types'

function resolveApiDataPath(fileName: string): string {
	const cwd = process.cwd()
	const apiRoot = path.basename(cwd) === 'api'
		? cwd
		: path.resolve(cwd, 'api')
	return path.resolve(apiRoot, 'data', fileName)
}

const ORDERS_FILE_PATH = resolveApiDataPath('orders.json')

type OrderStore = {
	orders: Order[],
}

@Injectable()
export class FileOrderRepository extends OrderRepository {
	private static writeQueue = Promise.resolve()

	async listOrders(query?: ListOrdersQueryDto): Promise<Order[]> {
		const filtered = await this.filterOrders(query)
		const offset = query?.offset ?? 0
		const limit = query?.limit

		return limit === undefined
			? filtered.slice(offset)
			: filtered.slice(offset, offset + limit)
	}

	async countOrders(query?: ListOrdersQueryDto): Promise<number> {
		const filtered = await this.filterOrders(query)
		return filtered.length
	}

	async getOrderById(id: string): Promise<Order | null> {
		const store = await this.readStore()
		return store.orders.find(order => order.id === id) ?? null
	}

	async createOrderFromCart(cart: Cart): Promise<Order> {
		return this.mutateStore(store => {
			const now = new Date().toISOString()
			const maxDisplayId = store.orders.reduce((max, order) => Math.max(max, order.display_id), 1000)
			const order: Order = {
				id: `order_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
				status: 'pending',
				display_id: maxDisplayId + 1,
				email: null,
				customer_id: null,
				currency_code: 'rub',
				created_at: now,
				updated_at: now,
				items: cart.items.map(item => ({
					id: item.id,
					title: item.title,
					product_id: item.product_id,
					variant_id: item.variant_id,
					variant_title: item.variant?.title ?? null,
					quantity: item.quantity,
					unit_price: item.unit_price,
					subtotal: item.total,
					item: {
						title: item.title,
						unit_price: item.unit_price,
					},
				})),
				summary: [{
					id: 'summary_total',
					title: 'Итого',
					totals: {
						current_order_total: {value: String(cart.total)},
					},
				}],
				shipping_methods: [],
				transactions: [],
				shipping_address: null,
				billing_address: null,
				metadata: {
					cart_id: cart.id,
				},
			}
			store.orders.unshift(order)
			return {
				nextStore: store,
				result: order,
			}
		})
	}

	async updateOrder(id: string, input: UpdateOrderDto): Promise<Order | null> {
		return this.mutateStore(store => {
			const index = store.orders.findIndex(order => order.id === id)
			if (index < 0) {
				return {
					nextStore: store,
					result: null,
				}
			}

			const existing = store.orders[index]
			if (!existing) {
				return {
					nextStore: store,
					result: null,
				}
			}

			const updated: Order = {
				...existing,
				status: input.status ?? existing.status,
				updated_at: new Date().toISOString(),
			}
			store.orders[index] = updated
			return {
				nextStore: store,
				result: updated,
			}
		})
	}

	async deleteOrder(id: string): Promise<boolean> {
		return this.mutateStore(store => {
			const nextOrders = store.orders.filter(order => order.id !== id)
			return {
				nextStore: {
					orders: nextOrders,
				},
				result: nextOrders.length !== store.orders.length,
			}
		})
	}

	async listOrdersByCustomerId(
		customerId: string,
		query?: {
			limit?: number,
			offset?: number,
		},
	): Promise<{orders: Order[], count: number}> {
		const store = await this.readStore()
		const filtered = [...store.orders]
			.filter(order => order.customer_id === customerId)
			.sort((a, b) => b.created_at.localeCompare(a.created_at))
		const offset = query?.offset ?? 0
		const limit = query?.limit
		return {
			orders: limit === undefined
				? filtered.slice(offset)
				: filtered.slice(offset, offset + limit),
			count: filtered.length,
		}
	}

	private async filterOrders(query?: ListOrdersQueryDto): Promise<Order[]> {
		const store = await this.readStore()
		const status = query?.status?.trim().toLowerCase()
		const customerId = query?.customer_id?.trim()
		const search = query?.q?.trim().toLowerCase()

		return [...store.orders]
			.filter(order => {
				if (status && order.status.toLowerCase() !== status) {
					return false
				}

				if (customerId && order.customer_id !== customerId) {
					return false
				}

				if (!search) {
					return true
				}

				return (order.email ?? '').toLowerCase().includes(search)
					|| String(order.display_id).includes(search)
			})
			.sort((a, b) => b.created_at.localeCompare(a.created_at))
	}

	private async readStore(): Promise<OrderStore> {
		try {
			const content = await readFile(ORDERS_FILE_PATH, 'utf8')
			const parsed = JSON.parse(content) as OrderStore
			const orders = Array.isArray(parsed.orders)
				? parsed.orders
				: []
			return {
				orders: orders.length > 0
					? orders
					: this.seedOrders(),
			}
		}
		catch {
			return {
				orders: this.seedOrders(),
			}
		}
	}

	private async writeStore(store: OrderStore): Promise<void> {
		await mkdir(path.dirname(ORDERS_FILE_PATH), {recursive: true})
		await writeFile(ORDERS_FILE_PATH, `${JSON.stringify(store, null, 2)}\n`, 'utf8')
	}

	private async mutateStore<T>(mutator: (store: OrderStore) => {
		nextStore: OrderStore,
		result: T,
	}): Promise<T> {
		const operation = FileOrderRepository.writeQueue.then(async () => {
			const store = await this.readStore()
			const {
				nextStore,
				result,
			} = mutator(store)
			await this.writeStore(nextStore)
			return result
		})
		FileOrderRepository.writeQueue = operation.then(() => undefined, () => undefined)
		return operation
	}

	private seedOrders(): Order[] {
		const now = new Date().toISOString()
		return [{
			id: 'order_seed_1',
			status: 'pending',
			display_id: 1001,
			email: 'customer@example.com',
			customer_id: null,
			currency_code: 'rub',
			created_at: now,
			updated_at: now,
			items: [{
				id: 'item_seed_1',
				title: 'Climbing Rope',
				product_title: 'Climbing Rope',
				quantity: 1,
				unit_price: 12990,
				subtotal: 12990,
			}],
			summary: [{
				id: 'summary_total',
				title: 'Итого',
				totals: {
					current_order_total: {value: '12990'},
				},
			}],
			shipping_methods: [],
			transactions: [],
			shipping_address: null,
			billing_address: null,
			metadata: null,
		}]
	}
}
