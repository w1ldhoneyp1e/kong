import {fetchAdminCustomerServer} from '../server'
import {CustomerDetailPageClient} from './CustomerDetailPageClient'

type Props = {params: Promise<{id: string}>}

export default async function AdminCustomerDetailPage({params}: Props) {
	const {id} = await params
	const initialCustomer = await fetchAdminCustomerServer(id)

	return (
		<CustomerDetailPageClient
			id={id}
			initialCustomer={initialCustomer}
		/>
	)
}
