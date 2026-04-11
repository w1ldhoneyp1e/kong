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

const adminStaffApi = {
	listStaffUsers: async (): Promise<ListStaffResult> => {
		const res = await fetch(`${getApiBase()}/staff/users`, {
			credentials: 'same-origin',
		})
		const data = (await parseRes(res)) as ListStaffResult & {error?: string}

		if (!res.ok) {
			throw new Error(messageFromErrorData(data))
		}

		return {
			users: data.users ?? [],
		}
	},

	getStaffUser: async (id: string): Promise<StaffUser> => {
		const res = await fetch(`${getApiBase()}/staff/users/${id}`, {
			credentials: 'same-origin',
		})
		const data = (await parseRes(res)) as {user?: StaffUser}

		if (!res.ok) {
			throw new Error(messageFromErrorData(data))
		}

		if (!data.user) {
			throw new Error('Пользователь не найден')
		}

		return data.user
	},

	createStaffUser: async (payload: CreateStaffPayload): Promise<StaffUser> => {
		const res = await fetch(`${getApiBase()}/staff/users`, {
			method: 'POST',
			credentials: 'same-origin',
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

		return data
	},

	updateStaffRole: async (
		id: string,
		payload: UpdateStaffRolePayload,
	): Promise<StaffUser> => {
		const res = await fetch(`${getApiBase()}/staff/users/${id}`, {
			method: 'PATCH',
			credentials: 'same-origin',
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
		const res = await fetch(`${getApiBase()}/staff/users/${id}`, {
			method: 'DELETE',
			credentials: 'same-origin',
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
