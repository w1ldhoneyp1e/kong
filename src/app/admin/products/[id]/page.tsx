import {fetchAdminProductServer} from '../server'
import {ProductDetailPageClient} from './DetailPageClient'

type Props = Readonly<{
	params: Promise<{id: string}>,
}>

export default async function AdminProductDetailPage({params}: Props) {
	const {id} = await params
	const initialProduct = await fetchAdminProductServer(id)

	return (
		<ProductDetailPageClient
			id={id}
			initialProduct={initialProduct}
		/>
	)
}
