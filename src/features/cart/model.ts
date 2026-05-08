'use client'

const CART_ID_KEY = 'kong_cart_id'
const CART_UPDATED_EVENT = 'kong_cart_updated'

type CartLine = {
	id: string,
	title?: string | null,
	quantity: number,
	unit_price?: number | null,
	total?: number | null,
	variant?: {
		title?: string | null,
		sku?: string | null,
	} | null,
}

type Cart = {
	id: string,
	items?: CartLine[],
	total?: number | null,
	item_total?: number | null,
	shipping_total?: number | null,
}

function getStoredCartId(): string | null {
	return localStorage.getItem(CART_ID_KEY)
}

function setStoredCartId(cartId: string): void {
	localStorage.setItem(CART_ID_KEY, cartId)
}

function clearStoredCartId(): void {
	localStorage.removeItem(CART_ID_KEY)
}

function emitCartUpdated(): void {
	window.dispatchEvent(new Event(CART_UPDATED_EVENT))
}

function cartItemsCount(cart: Cart | null): number {
	return cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
}

function cartItemsTotal(cart: Cart | null): number {
	if (!cart?.items) {
		return 0
	}

	return cart.items.reduce(
		(sum, item) => sum + (item.total ?? (item.unit_price ?? 0) * item.quantity),
		0,
	)
}

function formatCartMoney(amount: number): string {
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
	}).format(amount / 100)
}

export {
	CART_UPDATED_EVENT,
	clearStoredCartId,
	cartItemsCount,
	cartItemsTotal,
	emitCartUpdated,
	formatCartMoney,
	getStoredCartId,
	setStoredCartId,
}
export type {
	Cart,
	CartLine,
}
