import {getBackendUrl} from '../../../../shared'

type AccountMePayload = {
	authenticated: boolean,
	actorType: 'guest' | 'customer' | 'staff',
	email?: string | null,
	roleCode?: string | null,
	permissions?: string[],
}

type StaffMeJson = {
	staff?: {
		email?: string | null,
		roleCode?: string | null,
	},
	permissions?: string[],
}

async function buildCustomerAccountPreview(token: string): Promise<AccountMePayload> {
	const baseUrl = getBackendUrl()
	const res = await fetch(`${baseUrl}/customer/me`, {
		headers: {Authorization: `Bearer ${token}`},
		cache: 'no-store',
	})
	if (!res.ok) {
		return {
			authenticated: true,
			actorType: 'customer',
			email: null,
			roleCode: 'customer',
		}
	}

	const data = (await res.json()) as {customer?: {email?: string | null}}

	return {
		authenticated: true,
		actorType: 'customer',
		email: data.customer?.email ?? null,
		roleCode: 'customer',
	}
}

async function buildStaffAccountPreview(token: string): Promise<AccountMePayload> {
	const baseUrl = getBackendUrl()
	const res = await fetch(`${baseUrl}/staff/me`, {
		headers: {Authorization: `Bearer ${token}`},
		cache: 'no-store',
	})
	if (!res.ok) {
		return {
			authenticated: true,
			actorType: 'staff',
			email: null,
			roleCode: null,
			permissions: [],
		}
	}

	const data = (await res.json()) as StaffMeJson

	return {
		authenticated: true,
		actorType: 'staff',
		email: data.staff?.email ?? null,
		roleCode: data.staff?.roleCode ?? null,
		permissions: data.permissions ?? [],
	}
}

export type {AccountMePayload}
export {
	buildCustomerAccountPreview,
	buildStaffAccountPreview,
}
