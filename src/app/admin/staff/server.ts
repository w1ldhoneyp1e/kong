import {cookies} from 'next/headers'
import {type ListStaffResult} from '../../../entities/staff'
import {getBackendUrl} from '../../../shared'

const STAFF_TOKEN_COOKIE = 'kong_staff_token'

async function fetchAdminStaffUsersServer(): Promise<ListStaffResult | undefined> {
	const token = (await cookies()).get(STAFF_TOKEN_COOKIE)?.value
	if (!token) {
		return undefined
	}

	try {
		const res = await fetch(`${getBackendUrl()}/staff/users`, {
			headers: {Authorization: `Bearer ${token}`},
			cache: 'no-store',
		})
		if (!res.ok) {
			return undefined
		}

		const data = (await res.json()) as ListStaffResult

		return {
			users: data.users ?? [],
			count: typeof data.count === 'number'
				? data.count
				: undefined,
		}
	}
	catch {
		return undefined
	}
}

export {
	fetchAdminStaffUsersServer,
}
