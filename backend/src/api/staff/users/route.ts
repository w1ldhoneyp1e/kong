import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import bcrypt from 'bcryptjs'
import {randomUUID} from 'node:crypto'
import {RBAC_MODULE} from '../../../modules/rbac'
import {STAFF_MODULE} from '../../../modules/staff'
import {requirePermission} from '../../_shared/staffAuth'
import {getPrimaryStaffRoleCodeForActor, getStaffPermissions} from '../../_shared/staffPermissions'

type CreateStaffBody = {
	email?: string,
	password?: string,
	roleCode?: string,
	first_name?: string | null,
	last_name?: string | null,
}

function normalizeEmail(email: string): string {
	return email.trim().toLowerCase()
}

async function getRoleIdByCode(
	req: MedusaRequest,
	roleCode: string,
): Promise<string | null> {
	const rbacService = req.scope.resolve(RBAC_MODULE) as any
	const roles = await rbacService.listRoles({}, {take: 200}).catch(() => ([]))
	const role = (Array.isArray(roles)
		? roles
		: [])
		.find((r: any) => r?.code === roleCode) ?? null
	return role?.id ?? null
}

const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'staff:manage')
	if (!actor) {
		return
	}

	const body = req.body as CreateStaffBody | undefined
	const emailRaw = body?.email
	const password = body?.password
	const roleCodeRaw = body?.roleCode
	const firstNameRaw = body?.first_name
	const lastNameRaw = body?.last_name
	const firstName = typeof firstNameRaw === 'string'
		? firstNameRaw.trim() || null
		: null
	const lastName = typeof lastNameRaw === 'string'
		? lastNameRaw.trim() || null
		: null

	if (!emailRaw || typeof emailRaw !== 'string' || !password || typeof password !== 'string') {
		res.status(400).json({error: 'Не задан email/password'})
		return
	}

	const email = normalizeEmail(emailRaw)
	const roleCode = (roleCodeRaw && typeof roleCodeRaw === 'string')
		? roleCodeRaw
		: 'manager'

	if (roleCode === 'owner') {
		res.status(403).json({error: 'Owner нельзя создать через API'})
		return
	}

	if (roleCode !== 'manager') {
		const perms = await getStaffPermissions(req, actor.actor_id).catch(() => [])
		const canManageRoles = perms.includes('roles:manage')
		if (!canManageRoles) {
			res.status(403).json({error: 'Недостаточно прав'})
			return
		}
	}

	const staffService = req.scope.resolve(STAFF_MODULE) as any
	const existing = await staffService.listStaffUsers({email}, {take: 1}).catch(() => ([]))
	const userExists = Array.isArray(existing) && existing.length > 0

	const passwordHash = await bcrypt.hash(password, 12)

	let staffUserId: string
	if (!userExists) {
		const newId = randomUUID()
		try {
			await staffService.createStaffUsers([{
				id: newId,
				email,
				password_hash: passwordHash,
				first_name: firstName,
				last_name: lastName,
			}])
		}
		catch (e) {
			const msg = e instanceof Error
				? e.message
				: 'Не удалось создать пользователя'
			res.status(500).json({error: msg})

			return
		}

		const afterCreate = await staffService.listStaffUsers({email}, {take: 1}).catch(() => ([]))
		const row = Array.isArray(afterCreate)
			? afterCreate[0]
			: null
		if (!row || typeof (row as {id?: unknown}).id !== 'string') {
			res.status(500).json({error: 'Не удалось подтвердить создание пользователя'})

			return
		}

		staffUserId = (row as {id: string}).id
	}
	else {
		staffUserId = (existing[0] as {id: string}).id
	}

	const roleId = await getRoleIdByCode(req, roleCode)
	if (!roleId) {
		res.status(500).json({error: 'Роль не найдена'})
		return
	}

	const rbacService = req.scope.resolve(RBAC_MODULE) as any
	const existingRoleLinks = await rbacService.listActorRoles({
		actor_type: 'staff',
		actor_id: staffUserId,
	}, {take: 50}).catch(() => ([]))
	const alreadyHasRole = (Array.isArray(existingRoleLinks)
		? existingRoleLinks
		: [])
		.some((ar: {role_id?: string, role?: {id?: string}}) =>
			(ar.role_id ?? ar.role?.id) === roleId)

	if (!alreadyHasRole) {
		try {
			await rbacService.createActorRoles([{
				actor_type: 'staff',
				actor_id: staffUserId,
				role_id: roleId,
			}])
		}
		catch (e) {
			const msg = e instanceof Error
				? e.message
				: 'Не удалось назначить роль'
			res.status(500).json({error: msg})

			return
		}
	}

	res.status(201).json({
		id: staffUserId,
		email,
		first_name: firstName,
		last_name: lastName,
		roleCode,
	})
}

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'staff:manage')
	if (!actor) {
		return
	}

	const limitRaw = req.query['limit']
	const offsetRaw = req.query['offset']
	const limit = Math.min(
		10000,
		Math.max(1, parseInt(String(limitRaw ?? '5000'), 10) || 5000),
	)
	const offset = Math.max(0, parseInt(String(offsetRaw ?? '0'), 10) || 0)

	const staffService = req.scope.resolve(STAFF_MODULE) as any
	const listResult = await staffService.listAndCountStaffUsers({}, {
		take: limit,
		skip: offset,
	}).catch(() => null)

	function rowsFromListPayload(first: unknown): unknown[] {
		if (Array.isArray(first)) {
			return first
		}

		if (
			first
			&& typeof first === 'object'
			&& 'data' in first
			&& Array.isArray((first as {data: unknown}).data)
		) {
			return (first as {data: unknown[]}).data
		}

		return []
	}

	let staffUsers: unknown[] = []
	let total = 0
	if (Array.isArray(listResult) && listResult.length === 2) {
		staffUsers = rowsFromListPayload(listResult[0])
		const countPart = listResult[1]
		total = typeof countPart === 'number'
			? countPart
			: staffUsers.length
	}

	if (staffUsers.length === 0) {
		const users = await staffService.listStaffUsers({}, {take: limit, skip: offset}).catch(() => ([]))
		staffUsers = rowsFromListPayload(users)
		total = staffUsers.length
	}

	const enriched = await Promise.all(staffUsers.map(async (u: any) => {
		const roleCode = await getPrimaryStaffRoleCodeForActor(req, u.id)

		return {
			id: u.id,
			email: u.email,
			first_name: u.first_name ?? null,
			last_name: u.last_name ?? null,
			roleCode,
		}
	}))

	res.json({
		users: enriched,
		count: total,
	})
}

export {GET, POST}

