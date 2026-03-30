export type AdminNavItem = {
	id: string,
	href: string,
	label: string,
	requiredPermission?: string,
}

export const adminNavItems: AdminNavItem[] = [
	{
		id: 'categories',
		href: '/admin/categories',
		label: 'Категории',
		requiredPermission: 'catalog:manage',
	},
	{
		id: 'products',
		href: '/admin/products',
		label: 'Товары',
		requiredPermission: 'catalog:manage',
	},
	{
		id: 'orders',
		href: '/admin/orders',
		label: 'Заказы',
		requiredPermission: 'orders:manage',
	},
	{
		id: 'customers',
		href: '/admin/customers',
		label: 'Покупатели',
		requiredPermission: 'customers:manage',
	},
	{
		id: 'carts',
		href: '/admin/carts',
		label: 'Корзины',
		requiredPermission: 'carts:manage',
	},
	{
		id: 'store',
		href: '/admin/store',
		label: 'Магазин',
		requiredPermission: 'store:update',
	},
	{
		id: 'inventory-items',
		href: '/admin/inventory-items',
		label: 'Товары на складе',
		requiredPermission: 'inventory:manage',
	},
	{
		id: 'staff',
		href: '/admin/staff',
		label: 'Пользователи (staff)',
		requiredPermission: 'staff:manage',
	},
]
