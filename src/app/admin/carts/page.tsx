import {AdminEntityList} from '../AdminEntityList'

const columns = [
	{ key: 'id', label: 'ID' },
	{ key: 'status', label: 'Статус' },
	{ key: 'region_id', label: 'Регион' },
	{ key: 'created_at', label: 'Создана' },
]

const createFields = [
	{ key: 'region_id', label: 'ID региона' },
]

export default function AdminCartsPage() {
	return (
		<AdminEntityList
			title="Корзины"
			description="Список корзин"
			apiPath="carts"
			basePath="/admin/carts"
			columns={columns}
			createFields={createFields}
		/>
	)
}
