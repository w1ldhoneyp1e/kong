import {AdminEntityList} from '../AdminEntityList'

const columns = [
	{ key: 'id', label: 'ID' },
	{ key: 'name', label: 'Название' },
	{ key: 'address', label: 'Адрес' },
]

const createFields = [
	{ key: 'name', label: 'Название', required: true },
	{ key: 'address', label: 'Адрес' },
]

export default function AdminStockLocationsPage() {
	return (
		<AdminEntityList
			title="Склады"
			description="Склады и локации"
			apiPath="stock-locations"
			basePath="/admin/stock-locations"
			columns={columns}
			createFields={createFields}
		/>
	)
}
