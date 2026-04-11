import {cookies} from 'next/headers'
import {type ListStaffResult, type StaffUser} from '../../../entities/staff'
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
		}
	}
	catch {
		return undefined
	}
}

async function fetchAdminStaffUserServer(id: string): Promise<StaffUser | undefined> {
	const token = (await cookies()).get(STAFF_TOKEN_COOKIE)?.value
	if (!token) {
		return undefined
	}

	try {
		const res = await fetch(`${getBackendUrl()}/staff/users/${id}`, {
			headers: {Authorization: `Bearer ${token}`},
			cache: 'no-store',
		})
		if (!res.ok) {
			return undefined
		}

		const data = (await res.json()) as {user?: StaffUser}

		return data.user
	}
	catch {
		return undefined
	}
}

export {
	fetchAdminStaffUserServer,
	fetchAdminStaffUsersServer,
}
