import {getApiBase} from '../../../shared'
import {
	type CreateStaffPayload,
	type ListStaffResult,
	type StaffUser,
	type UpdateStaffRolePayload,
} from './types'

async function parseRes(res: Response): Promise<unknown> {
	const text = await res.text()

	if (!text) {
		return {}
	}

	try {
		return JSON.parse(text) as unknown
	}
	catch {
		throw new Error(res.ok
			? 'Ответ не JSON'
			: `HTTP ${res.status}: ${text.slice(0, 100)}`)
	}
}

function messageFromErrorData(data: unknown): string {
	if (!data || typeof data !== 'object') {
		return 'Ошибка запроса'
	}

	const o = data as {
		error?: unknown,
		message?: unknown,
	}
	const err = o.error
	if (typeof err === 'string' && err.length > 0) {
		return err
	}

	const msg = o.message
	if (typeof msg === 'string' && msg.length > 0) {
		return msg
	}

	return 'Ошибка запроса'
}

function staffUsersPath(id: string): string {
	return `${getApiBase()}/staff/users/${encodeURIComponent(id)}`
}

const adminStaffApi = {
	listStaffUsers: async (): Promise<ListStaffResult> => {
		const res = await fetch(`${getApiBase()}/staff/users`, {
			credentials: 'same-origin',
			cache: 'no-store',
		})
		const data = (await parseRes(res)) as ListStaffResult & {error?: string}

		if (!res.ok) {
			throw new Error(messageFromErrorData(data))
		}

		return {
			users: data.users ?? [],
			count: typeof data.count === 'number'
				? data.count
				: undefined,
		}
	},

	createStaffUser: async (payload: CreateStaffPayload): Promise<StaffUser> => {
		const res = await fetch(`${getApiBase()}/staff/users`, {
			method: 'POST',
			credentials: 'same-origin',
			cache: 'no-store',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(payload),
		})
		const raw = await parseRes(res)
		const data = raw as StaffUser & {error?: string}

		if (!res.ok) {
			throw new Error(messageFromErrorData(raw))
		}

		if (!data.id || !data.email) {
			throw new Error('Ответ без пользователя')
		}

		return {
			...data,
			first_name: data.first_name ?? null,
			last_name: data.last_name ?? null,
		}
	},

	updateStaffRole: async (
		id: string,
		payload: UpdateStaffRolePayload,
	): Promise<StaffUser> => {
		const res = await fetch(staffUsersPath(id), {
			method: 'PATCH',
			credentials: 'same-origin',
			cache: 'no-store',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(payload),
		})
		const raw = await parseRes(res)
		const data = raw as {user?: StaffUser}

		if (!res.ok) {
			throw new Error(messageFromErrorData(raw))
		}

		if (!data.user) {
			throw new Error('Ответ без пользователя')
		}

		return data.user
	},

	deleteStaffUser: async (id: string): Promise<void> => {
		const res = await fetch(staffUsersPath(id), {
			method: 'DELETE',
			credentials: 'same-origin',
			cache: 'no-store',
		})

		if (res.status === 204) {
			return
		}

		const raw = await parseRes(res)

		if (!res.ok) {
			throw new Error(messageFromErrorData(raw))
		}
	},
}

export {adminStaffApi}
