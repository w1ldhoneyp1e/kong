import {AdminEntityList} from '../AdminEntityList'

const columns = [
	{
		key: 'email',
		label: 'Email',
	},
	{
		key: 'roleCode',
		label: 'Роль',
	},
]

const createFields = [
	{
		key: 'email',
		label: 'Email',
		required: true,
	},
	{
		key: 'password',
		label: 'Пароль',
		required: true,
	},
]

export default function AdminStaffPage() {
	return (
		<AdminEntityList
			title="Пользователи (staff)"
			description="Owner / Admin / Manager (роли через RBAC)"
			apiPath="staff/users"
			basePath="/admin/staff"
			columns={columns}
			createFields={createFields}
		/>
	)
}

