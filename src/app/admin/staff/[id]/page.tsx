import {AdminEntityDetail} from '../../AdminEntityDetail'

type Props = {params: Promise<{id: string}>}

export default async function AdminStaffDetailPage({params}: Props) {
	const {id} = await params

	return (
		<AdminEntityDetail
			entity="staff/users"
			id={id}
			title="Пользователь"
			backHref="/admin/staff"
		/>
	)
}

