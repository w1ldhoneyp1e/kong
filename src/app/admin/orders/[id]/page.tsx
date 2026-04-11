import {fetchAdminOrderServer} from '../server'
import {OrderDetailPageClient} from './OrderDetailPageClient'

type Props = {params: Promise<{id: string}>}

export default async function AdminOrderDetailPage({params}: Props) {
	const {id} = await params
	const initialOrder = await fetchAdminOrderServer(id)

	return (
		<OrderDetailPageClient
			id={id}
			initialOrder={initialOrder}
		/>
	)
}
