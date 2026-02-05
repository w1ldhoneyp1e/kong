import {AdminEntityDetail} from '../../AdminEntityDetail'

const editFields = [
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

type Props = {params: Promise<{id: string}>}

export default async function AdminProductDetailPage({params}: Props) {
	const {id} = await params

	return (
		<AdminEntityDetail
			entity="products"
			id={id}
			title="Товар"
			backHref="/admin/products"
			editFields={editFields}
		/>
	)
}
