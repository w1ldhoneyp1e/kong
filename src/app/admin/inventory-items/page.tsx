import {AdminEntityList} from '../AdminEntityList'

const columns = [
	{ key: 'id', label: 'ID' },
	{ key: 'sku', label: 'SKU' },
	{ key: 'title', label: 'Название' },
	{ key: 'created_at', label: 'Создан' },
]

const createFields = [
	{ key: 'sku', label: 'SKU' },
	{ key: 'title', label: 'Название' },
]

export default function AdminInventoryItemsPage() {
	return (
		<AdminEntityList
			title="Товары на складе"
			description="Остатки и учёт"
			apiPath="inventory-items"
			basePath="/admin/inventory-items"
			columns={columns}
			createFields={createFields}
		/>
	)
}
