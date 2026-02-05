import {AdminEntityDetail} from '../../AdminEntityDetail'

const editFields = [
	{
		key: 'sku',
		label: 'SKU',
	},
	{
		key: 'title',
		label: 'Название',
	},
]

type Props = {params: Promise<{id: string}>}

export default async function AdminInventoryItemDetailPage({params}: Props) {
	const {id} = await params

	return (
		<AdminEntityDetail
			entity="inventory-items"
			id={id}
			title="Товар на складе"
			backHref="/admin/inventory-items"
			editFields={editFields}
		/>
	)
}
