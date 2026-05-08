type CartLine = {
	id: string,
	variant_id: string,
	product_id: string,
	title: string,
	quantity: number,
	unit_price: number,
	total: number,
	variant?: {
		title?: string | null,
		sku?: string | null,
	} | null,
}

type Cart = {
	id: string,
	region_id: string | null,
	items: CartLine[],
	total: number,
	item_total: number,
	shipping_total: number,
}

export type {
	Cart,
	CartLine,
}
