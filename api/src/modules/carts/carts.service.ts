import {
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import {CatalogRepository} from '../catalog/repositories/catalog.repository'
import {OrdersService} from '../orders/orders.service'
import {CreateCartDto} from './dto/create-cart.dto'
import {CartLineItemDto} from './dto/cart-line-item.dto'
import {CartRepository} from './repositories/cart.repository'
import {Cart, CartLine} from './types/cart.types'

@Injectable()
export class CartsService {
	constructor(
		@Inject(CartRepository)
		private readonly cartRepository: CartRepository,
		@Inject(CatalogRepository)
		private readonly catalogRepository: CatalogRepository,
		private readonly ordersService: OrdersService,
	) {}

	async getCart(id: string): Promise<{cart: Cart}> {
		const cart = await this.cartRepository.getCartById(id)
		if (!cart) {
			throw new NotFoundException('Корзина не найдена')
		}

		return {cart}
	}

	async createCart(input: CreateCartDto): Promise<{cart: Cart}> {
		const cart = await this.cartRepository.createCart(input)
		return {cart}
	}

	async addLineItem(cartId: string, input: CartLineItemDto): Promise<{cart: Cart}> {
		if (!input.variant_id) {
			throw new NotFoundException('Не задан variant_id')
		}

		const cart = await this.requireCart(cartId)
		const variantDetails = await this.findVariant(input.variant_id)
		const existing = cart.items.find(item => item.variant_id === input.variant_id)
		if (existing) {
			existing.quantity += input.quantity ?? 1
			existing.total = existing.unit_price * existing.quantity
		}
		else {
			cart.items.push({
				id: this.createLineId(),
				variant_id: variantDetails.variant.id,
				product_id: variantDetails.product.id,
				title: variantDetails.product.title,
				quantity: input.quantity ?? 1,
				unit_price: variantDetails.unitPrice,
				total: variantDetails.unitPrice * (input.quantity ?? 1),
				variant: {
					title: variantDetails.variant.title,
					sku: variantDetails.variant.sku,
				},
			})
		}

		return {
			cart: await this.persistTotals(cart),
		}
	}

	async updateLineItem(
		cartId: string,
		lineId: string,
		input: CartLineItemDto,
	): Promise<{cart: Cart}> {
		const cart = await this.requireCart(cartId)
		const line = cart.items.find(item => item.id === lineId)
		if (!line) {
			throw new NotFoundException('Позиция корзины не найдена')
		}

		line.quantity = input.quantity ?? 1
		line.total = line.unit_price * line.quantity

		return {
			cart: await this.persistTotals(cart),
		}
	}

	async removeLineItem(cartId: string, lineId: string): Promise<{cart: Cart}> {
		const cart = await this.requireCart(cartId)
		cart.items = cart.items.filter(item => item.id !== lineId)
		return {
			cart: await this.persistTotals(cart),
		}
	}

	async deleteCart(id: string): Promise<void> {
		const deleted = await this.cartRepository.deleteCart(id)
		if (!deleted) {
			throw new NotFoundException('Корзина не найдена')
		}
	}

	async completeCart(id: string): Promise<{type: 'order', order: {id: string}}> {
		const cart = await this.requireCart(id)
		const order = await this.ordersService.createOrderFromCart(cart)
		await this.cartRepository.deleteCart(id)
		return {
			type: 'order',
			order: {id: order.id},
		}
	}

	private async requireCart(id: string): Promise<Cart> {
		const cart = await this.cartRepository.getCartById(id)
		if (!cart) {
			throw new NotFoundException('Корзина не найдена')
		}

		return cart
	}

	private async findVariant(variantId: string): Promise<{
		product: {id: string, title: string},
		variant: {id: string, title: string, sku: string | null},
		unitPrice: number,
	}> {
		const products = await this.catalogRepository.listProducts()
		for (const product of products) {
			const variant = product.variants.find(item => item.id === variantId)
			if (!variant) {
				continue
			}

			return {
				product: {
					id: product.id,
					title: product.title,
				},
				variant: {
					id: variant.id,
					title: variant.title,
					sku: variant.sku,
				},
				unitPrice: variant.prices[0]?.amount ?? 0,
			}
		}

		throw new NotFoundException('Вариант товара не найден')
	}

	private async persistTotals(cart: Cart): Promise<Cart> {
		const nextItems = cart.items.map(item => this.normalizeLine(item))
		const itemTotal = nextItems.reduce((sum, item) => sum + item.total, 0)
		const nextCart: Cart = {
			...cart,
			items: nextItems,
			item_total: itemTotal,
			shipping_total: 0,
			total: itemTotal,
		}
		return this.cartRepository.updateCart(nextCart)
	}

	private normalizeLine(line: CartLine): CartLine {
		return {
			...line,
			total: line.unit_price * line.quantity,
		}
	}

	private createLineId(): string {
		return `line_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
	}
}
