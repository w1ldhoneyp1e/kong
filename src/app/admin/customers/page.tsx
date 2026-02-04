import {AdminEntityList} from '../AdminEntityList'

const columns = [
	{ key: 'id', label: 'ID' },
	{ key: 'email', label: 'Email' },
	{ key: 'first_name', label: 'Имя' },
	{ key: 'last_name', label: 'Фамилия' },
]

const createFields = [
	{ key: 'email', label: 'Email', required: true },
	{ key: 'first_name', label: 'Имя' },
	{ key: 'last_name', label: 'Фамилия' },
]

export default function AdminCustomersPage() {
	return (
		<AdminEntityList
			title="Покупатели"
			description="Список покупателей"
			apiPath="customers"
			basePath="/admin/customers"
			columns={columns}
			createFields={createFields}
		/>
	)
}
