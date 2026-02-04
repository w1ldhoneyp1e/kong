export type AdminNavItem = {
	id: string,
	href: string,
	label: string,
}

export const adminNavItems: AdminNavItem[] = [
	{
		id: 'categories',
		href: '/admin/categories',
		label: 'Категории',
	},
	{
		id: 'products',
		href: '/admin/products',
		label: 'Товары',
	},
	{
		id: 'orders',
		href: '/admin/orders',
		label: 'Заказы',
	},
	{
		id: 'customers',
		href: '/admin/customers',
		label: 'Покупатели',
	},
	{
		id: 'carts',
		href: '/admin/carts',
		label: 'Корзины',
	},
	{
		id: 'store',
		href: '/admin/store',
		label: 'Магазин',
	},
	{
		id: 'inventory-items',
		href: '/admin/inventory-items',
		label: 'Товары на складе',
	},
	{
		id: 'stock-locations',
		href: '/admin/stock-locations',
		label: 'Склады',
	},
]
