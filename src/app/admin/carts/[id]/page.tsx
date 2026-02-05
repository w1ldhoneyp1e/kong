import {AdminEntityDetail} from '../../AdminEntityDetail'

const editFields = [
	{
		key: 'region_id',
		label: 'ID региона',
	},
	{
		key: 'status',
		label: 'Статус',
	},
]

type Props = {params: Promise<{id: string}>}

export default async function AdminCartDetailPage({params}: Props) {
	const {id} = await params

	return (
		<AdminEntityDetail
			entity="carts"
			id={id}
			title="Корзина"
			backHref="/admin/carts"
			editFields={editFields}
		/>
	)
}
