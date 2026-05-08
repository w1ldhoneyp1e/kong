type OrderStatus =
	| 'pending'
	| 'completed'
	| 'canceled'
	| 'archived'
	| 'requires_action'
	| 'draft'

type OrderMoneyAmount = {
	amount?: number | null,
	currency_code?: string | null,
}

type OrderAddress = {
	id?: string,
	first_name?: string | null,
	last_name?: string | null,
	address_1?: string | null,
	city?: string | null,
	country_code?: string | null,
	postal_code?: string | null,
	phone?: string | null,
}

type OrderItem = {
	id: string,
	title?: string | null,
	subtitle?: string | null,
	quantity?: number | null,
	unit_price?: number | OrderMoneyAmount | null,
	subtotal?: number | OrderMoneyAmount | null,
	product_id?: string | null,
	product_title?: string | null,
	variant_id?: string | null,
	variant_title?: string | null,
	item?: {
		title?: string | null,
		subtitle?: string | null,
		unit_price?: number | OrderMoneyAmount | null,
	} | null,
}

type OrderSummaryRow = {
	id?: string,
	title?: string | null,
	total?: OrderMoneyAmount | number | null,
	raw_total?: OrderMoneyAmount | null,
	totals?: {
		current_order_total?: {value?: string},
		order_total?: {value?: string},
	} | null,
}

type OrderTransaction = {
	id?: string,
	amount?: OrderMoneyAmount | number | null,
	currency_code?: string | null,
}

type OrderShippingMethod = {
	id?: string,
	name?: string | null,
	amount?: OrderMoneyAmount | number | null,
}

type Order = {
	id: string,
	status: OrderStatus,
	display_id: number,
	email: string | null,
	customer_id: string | null,
	currency_code: string | null,
	total?: number | null,
	created_at: string,
	updated_at: string,
	items: OrderItem[],
	summary: OrderSummaryRow[],
	shipping_methods: OrderShippingMethod[],
	transactions: OrderTransaction[],
	shipping_address: OrderAddress | null,
	billing_address: OrderAddress | null,
	metadata: Record<string, unknown> | null,
}

export type {
	Order,
	OrderAddress,
	OrderItem,
	OrderMoneyAmount,
	OrderShippingMethod,
	OrderStatus,
	OrderSummaryRow,
	OrderTransaction,
}
