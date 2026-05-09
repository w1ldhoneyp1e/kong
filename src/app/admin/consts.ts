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
		id: 'store',
		href: '/admin/store',
		label: 'Настройки магазина',
		requiredPermission: 'catalog:manage',
	},
	{
		id: 'pages',
		href: '/admin/pages',
		label: 'Страницы',
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
		id: 'staff',
		href: '/admin/staff',
		label: 'Работники',
		requiredPermission: 'staff:manage',
	},
]
