import {fetchAdminStaffUsersServer} from './server'
import {StaffListPageClient} from './ui/StaffListPageClient'

export default async function AdminStaffPage() {
	const initialList = await fetchAdminStaffUsersServer()

	return <StaffListPageClient initialList={initialList} />
}
