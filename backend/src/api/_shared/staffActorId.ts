const UUID_LIKE_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function normalizeStaffActorId(raw: string): string {
	const s = raw.trim()
	if (s.includes('@')) {
		return s.toLowerCase()
	}

	if (UUID_LIKE_RE.test(s)) {
		return s.toLowerCase()
	}

	return s
}

function routeStaffUserParamId(params: {id?: string | string[]} | undefined): string {
	const raw = params?.id
	if (typeof raw === 'string') {
		return raw
	}

	if (Array.isArray(raw) && typeof raw[0] === 'string') {
		return raw[0]
	}

	return ''
}

type StaffUserModuleServiceLike = {
	listStaffUsers: (f: unknown, c: unknown) => Promise<unknown>,
	retrieveStaffUser?: (id: string) => Promise<unknown>,
}

function hasStringId(u: unknown): u is {id: string} {
	return typeof u === 'object'
		&& u !== null
		&& typeof (u as {id?: unknown}).id === 'string'
		&& (u as {id: string}).id.length > 0
}

async function resolveStaffUserFromRouteParam(
	staffService: StaffUserModuleServiceLike,
	rawParam: string,
): Promise<unknown> {
	const param = normalizeStaffActorId(rawParam)
	if (!param) {
		return null
	}

	if (typeof staffService.retrieveStaffUser === 'function') {
		const one = await staffService.retrieveStaffUser(param).catch(() => null)
		if (hasStringId(one)) {
			return one
		}
	}

	let users = await staffService.listStaffUsers({id: param}, {take: 1}).catch(() => ([]))
	if (!Array.isArray(users) || users.length === 0) {
		users = await staffService.listStaffUsers({id: {$eq: param}} as never, {take: 1}).catch(() => ([]))
	}
	if (!Array.isArray(users) || users.length === 0) {
		if (param.includes('@')) {
			users = await staffService.listStaffUsers({email: param}, {take: 1}).catch(() => ([]))
		}
	}

	if (Array.isArray(users) && users.length > 0) {
		return users[0]
	}

	const all = await staffService.listStaffUsers({}, {take: 10000}).catch(() => ([]))
	if (!Array.isArray(all) || all.length === 0) {
		return null
	}

	const byId = all.find((u: unknown) => hasStringId(u) && u.id === param)
	if (byId) {
		return byId
	}

	return all.find((u: unknown) => hasStringId(u) && u.id.toLowerCase() === param.toLowerCase()) ?? null
}

export {
	normalizeStaffActorId,
	resolveStaffUserFromRouteParam,
	routeStaffUserParamId,
}
