import {CustomersListPageClient} from './CustomersListPageClient'
import {fetchAdminCustomersServer} from './server'

export default async function AdminCustomersPage() {
	const initialList = await fetchAdminCustomersServer({
		limit: 20,
		offset: 0,
	})

	return <CustomersListPageClient initialList={initialList} />
}
