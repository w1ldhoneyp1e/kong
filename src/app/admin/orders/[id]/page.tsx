import {AdminEntityDetail} from '../../AdminEntityDetail'

const editFields = [
	{
		key: 'status',
		label: 'Статус',
	},
]

type Props = {params: Promise<{id: string}>}

export default async function AdminOrderDetailPage({params}: Props) {
	const {id} = await params

	return (
		<AdminEntityDetail
			entity="orders"
			id={id}
			title="Заказ"
			backHref="/admin/orders"
			editFields={editFields}
		/>
	)
}
