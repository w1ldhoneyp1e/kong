import {AdminEntityDetail} from '../../AdminEntityDetail'

const editFields = [
	{
		key: 'email',
		label: 'Email',
	},
	{
		key: 'first_name',
		label: 'Имя',
	},
	{
		key: 'last_name',
		label: 'Фамилия',
	},
]

type Props = {params: Promise<{id: string}>}

export default async function AdminCustomerDetailPage({params}: Props) {
	const {id} = await params

	return (
		<AdminEntityDetail
			entity="customers"
			id={id}
			title="Покупатель"
			backHref="/admin/customers"
			editFields={editFields}
		/>
	)
}
