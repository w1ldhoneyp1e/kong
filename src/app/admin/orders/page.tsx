import {OrdersListPageClient} from './OrdersListPageClient'
import {fetchAdminOrdersServer} from './server'

export default async function AdminOrdersPage() {
	const initialList = await fetchAdminOrdersServer({
		limit: 20,
		offset: 0,
	})

	return <OrdersListPageClient initialList={initialList} />
}
