import {AdminEntityList} from '../AdminEntityList'

const columns = [
	{
		key: 'id',
		label: 'ID',
	},
	{
		key: 'status',
		label: 'Статус',
	},
	{
		key: 'display_id',
		label: 'Номер',
	},
	{
		key: 'created_at',
		label: 'Создан',
	},
]

export default function AdminOrdersPage() {
	return (
		<AdminEntityList
			title="Заказы"
			description="Список заказов"
			apiPath="orders"
			basePath="/admin/orders"
			columns={columns}
		/>
	)
}
