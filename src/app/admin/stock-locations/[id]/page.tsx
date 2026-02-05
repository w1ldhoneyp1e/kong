import {AdminEntityDetail} from '../../AdminEntityDetail'

const editFields = [
	{
		key: 'name',
		label: 'Название',
	},
	{
		key: 'address',
		label: 'Адрес',
	},
]

type Props = {params: Promise<{id: string}>}

export default async function AdminStockLocationDetailPage({params}: Props) {
	const {id} = await params

	return (
		<AdminEntityDetail
			entity="stock-locations"
			id={id}
			title="Склад"
			backHref="/admin/stock-locations"
			editFields={editFields}
		/>
	)
}
