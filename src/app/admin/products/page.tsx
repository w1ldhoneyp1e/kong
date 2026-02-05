import {AdminEntityList} from '../AdminEntityList'

const columns = [
	{
		key: 'id',
		label: 'ID',
	},
	{
		key: 'title',
		label: 'Название',
	},
	{
		key: 'handle',
		label: 'Handle',
	},
	{
		key: 'status',
		label: 'Статус',
	},
]

const createFields = [
	{
		key: 'title',
		label: 'Название',
		required: true,
	},
	{
		key: 'handle',
		label: 'Handle (URL)',
	},
]

export default function AdminProductsPage() {
	return (
		<AdminEntityList
			title="Товары"
			description="Список товаров"
			apiPath="products"
			basePath="/admin/products"
			columns={columns}
			createFields={createFields}
		/>
	)
}
