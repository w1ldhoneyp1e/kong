import {fetchAdminStaffUserServer} from '../server'
import {StaffDetailPageClient} from './StaffDetailPageClient'

type Props = {params: Promise<{id: string}>}

export default async function AdminStaffDetailPage({params}: Props) {
	const {id} = await params
	const decoded = decodeURIComponent(id)
	const initialUser = await fetchAdminStaffUserServer(decoded)

	return (
		<StaffDetailPageClient
			id={decoded}
			initialUser={initialUser}
		/>
	)
}
