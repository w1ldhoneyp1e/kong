import {AdminProductForm} from '../../../../../features/admin-product-form'
import {fetchAdminProductServer} from '../../server'

type Props = Readonly<{
	params: Promise<{id: string}>,
}>

export default async function AdminProductEditPage({params}: Props) {
	const {id} = await params
	const initialProduct = await fetchAdminProductServer(id)

	return (
		<AdminProductForm
			mode="edit"
			productId={id}
			initialProduct={initialProduct}
		/>
	)
}
