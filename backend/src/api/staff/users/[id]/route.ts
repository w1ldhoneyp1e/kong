import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {RBAC_MODULE} from '../../../../modules/rbac'
import {STAFF_MODULE} from '../../../../modules/staff'
import {requirePermission} from '../../../_shared/staffAuth'
import {getStaffPermissions} from '../../../_shared/staffPermissions'

function normalizeActorId(id: string): string {
	return id.trim().toLowerCase()
}

async function getRoleIdByCode(
	req: MedusaRequest,
	roleCode: string,
): Promise<string | null> {
	const rbacService = req.scope.resolve(RBAC_MODULE) as unknown as {
		listRoles: (f: unknown, c: unknown) => Promise<unknown[]>,
	}
	const roles = await rbacService.listRoles({}, {take: 200}).catch(() => ([]))
	const role = (Array.isArray(roles)
		? roles
		: [])
		.find((r: {code?: string}) => r?.code === roleCode) ?? null

	return role?.id ?? null
}

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'staff:manage')
	if (!actor) {
		return
	}

	const {id} = req.params as {id?: string}
	if (!id || typeof id !== 'string') {
		res.status(400).json({error: 'Некорректный id'})
		return
	}

	const actorId = normalizeActorId(id)

	const staffService = req.scope.resolve(STAFF_MODULE) as any
	const users = await staffService.listStaffUsers({id: actorId}, {take: 1}).catch(() => ([]))
	const user = Array.isArray(users)
		? users[0]
		: null
	if (!user?.id) {
		res.status(404).json({error: 'User not found'})
		return
	}

	const rbacService = req.scope.resolve(RBAC_MODULE) as any
	const actorRoles = await rbacService.listActorRoles({
		actor_type: 'staff',
		actor_id: actorId,
	}, {take: 10}).catch(() => ([]))

	const roleCodes = (Array.isArray(actorRoles)
		? actorRoles
		: [])
		.map((ar: any) => ar.role?.code)
		.filter((v: unknown) => typeof v === 'string') as string[]

	const roleCode = roleCodes.includes('owner')
		? 'owner'
		: roleCodes.includes('admin')
			? 'admin'
			: roleCodes.includes('manager')
				? 'manager'
				: roleCodes[0] ?? null

	res.json({
		user: {
			id: user.id,
			email: user.email,
			roleCode,
			created_at: (user as {created_at?: string}).created_at ?? null,
		},
	})
}

type PatchStaffBody = {
	roleCode?: string,
}

const PATCH = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'staff:manage')
	if (!actor) {
		return
	}

	const {id} = req.params as {id?: string}
	if (!id || typeof id !== 'string') {
		res.status(400).json({error: 'Некорректный id'})
		return
	}

	const body = req.body as PatchStaffBody | undefined
	const roleCodeRaw = body?.roleCode
	if (!roleCodeRaw || typeof roleCodeRaw !== 'string') {
		res.status(400).json({error: 'Не задан roleCode'})
		return
	}

	const roleCode = roleCodeRaw.trim()
	if (roleCode === 'owner') {
		res.status(403).json({error: 'Роль owner нельзя назначить через API'})
		return
	}

	const actorId = normalizeActorId(id)

	const rbacService = req.scope.resolve(RBAC_MODULE) as unknown as {
		listActorRoles: (f: unknown, c: unknown) => Promise<unknown[]>,
		deleteActorRoles: (f: unknown) => Promise<unknown>,
		createActorRoles: (rows: unknown[]) => Promise<unknown>,
		listRoles: (f: unknown, c: unknown) => Promise<unknown[]>,
	}

	const actorRoles = await rbacService.listActorRoles({
		actor_type: 'staff',
		actor_id: actorId,
	}, {take: 50}).catch(() => ([]))

	const ownerRoles = await rbacService.listRoles({code: 'owner'}, {take: 1}).catch(() => ([]))
	const ownerRoleId = Array.isArray(ownerRoles)
		? ownerRoles[0]?.id
		: null

	const isTargetOwner = (Array.isArray(actorRoles)
		? actorRoles
		: []).some(
		(ar: {
			role_id?: string,
			role?: {id?: string},
		}) =>
			(ar.role_id ?? ar.role?.id) === ownerRoleId,
	)

	if (isTargetOwner) {
		res.status(403).json({error: 'Роль owner нельзя изменить'})
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

	const roleId = await getRoleIdByCode(req, roleCode)
	if (!roleId) {
		res.status(500).json({error: 'Роль не найдена'})
		return
	}

	await rbacService.deleteActorRoles({
		actor_type: 'staff',
		actor_id: actorId,
	}).catch(() => {})

	await rbacService.createActorRoles([{
		actor_type: 'staff',
		actor_id: actorId,
		role_id: roleId,
	}]).catch(() => {})

	const staffService = req.scope.resolve(STAFF_MODULE) as {
		listStaffUsers: (f: unknown, c: unknown) => Promise<{email?: string | null}[]>,
	}
	const usersAfter = await staffService.listStaffUsers({id: actorId}, {take: 1}).catch(() => ([]))
	const row = Array.isArray(usersAfter)
		? usersAfter[0]
		: null

	res.json({
		user: {
			id: actorId,
			email: row?.email ?? null,
			roleCode,
		},
	})
}

const DELETE = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'staff:manage')
	if (!actor) {
		return
	}

	const {id} = req.params as {id?: string}
	if (!id || typeof id !== 'string') {
		res.status(400).json({error: 'Некорректный id'})
		return
	}

	const actorId = normalizeActorId(id)

	const rbacService = req.scope.resolve(RBAC_MODULE) as any
	const actorRoles = await rbacService.listActorRoles({
		actor_type: 'staff',
		actor_id: actorId,
	}, {take: 50}).catch(() => ([]))

	const ownerRoles = await rbacService.listRoles({code: 'owner'}, {take: 1}).catch(() => ([]))
	const ownerRoleId = Array.isArray(ownerRoles)
		? ownerRoles[0]?.id
		: null

	const isOwner = (Array.isArray(actorRoles)
		? actorRoles
		: []).some(
		ar => (ar.role_id ?? ar.role?.id) === ownerRoleId,
	)

	if (isOwner) {
		res.status(403).json({error: 'Owner нельзя удалить'})
		return
	}

	const staffService = req.scope.resolve(STAFF_MODULE) as any
	await staffService.deleteStaffUsers([actorId]).catch(() => {})

	await rbacService.deleteActorRoles({
		actor_type: 'staff',
		actor_id: actorId,
	}).catch(() => {})

	res.status(204).send()
}

export {
	DELETE, GET, PATCH,
}

