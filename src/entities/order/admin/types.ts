type AdminMoneyAmount = {
	amount?: number | null,
	currency_code?: string | null,
	raw?: unknown,
}

type AdminOrderAddress = {
	id?: string,
	first_name?: string | null,
	last_name?: string | null,
	address_1?: string | null,
	city?: string | null,
	country_code?: string | null,
	postal_code?: string | null,
	phone?: string | null,
}

type AdminOrderSummaryRow = {
	id?: string,
	title?: string | null,
	total?: AdminMoneyAmount | number | null,
	raw_total?: AdminMoneyAmount | null,
	totals?: unknown,
}

type AdminOrderItem = {
	id: string,
	title?: string | null,
	subtitle?: string | null,
	quantity?: number | null,
	unit_price?: number | AdminMoneyAmount | null,
	subtotal?: number | AdminMoneyAmount | null,
	product_id?: string | null,
	product_title?: string | null,
	variant_id?: string | null,
	variant_title?: string | null,
	item?: {
		title?: string | null,
		subtitle?: string | null,
		unit_price?: number | AdminMoneyAmount | null,
	} | null,
}

type AdminOrderTransaction = {
	id?: string,
	amount?: AdminMoneyAmount | number | null,
	currency_code?: string | null,
}

type AdminOrderShippingMethod = {
	id?: string,
	name?: string | null,
	amount?: AdminMoneyAmount | number | null,
}

type OrderStatus = string

type AdminOrder = {
	id: string,
	status?: OrderStatus | null,
	display_id?: number | null,
	email?: string | null,
	customer_id?: string | null,
	currency_code?: string | null,
	created_at?: string | null,
	updated_at?: string | null,
	items?: AdminOrderItem[],
	summary?: AdminOrderSummaryRow[],
	shipping_methods?: AdminOrderShippingMethod[],
	transactions?: AdminOrderTransaction[],
	shipping_address?: AdminOrderAddress | null,
	billing_address?: AdminOrderAddress | null,
	metadata?: Record<string, unknown> | null,
}

type ListOrdersQuery = {
	status?: string,
	limit?: number,
	offset?: number,
	q?: string,
	customer_id?: string,
}

type UpdateOrderPayload = {
	status?: string,
} & Record<string, unknown>

type ListOrdersResult = {
	orders: AdminOrder[],
	count?: number,
}

export type {
	AdminMoneyAmount,
	AdminOrder,
	AdminOrderAddress,
	AdminOrderItem,
	AdminOrderShippingMethod,
	AdminOrderSummaryRow,
	AdminOrderTransaction,
	ListOrdersQuery,
	ListOrdersResult,
	OrderStatus,
	UpdateOrderPayload,
}
