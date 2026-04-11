import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {RBAC_MODULE} from '../../../../modules/rbac'
import {STAFF_MODULE} from '../../../../modules/staff'
import {requirePermission} from '../../../_shared/staffAuth'
import {getPrimaryStaffRoleCodeForActor, getStaffPermissions} from '../../../_shared/staffPermissions'
import {resolveStaffUserFromRouteParam, routeStaffUserParamId} from '../../../_shared/staffActorId'

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

	const id = routeStaffUserParamId(req.params as {id?: string | string[]})
	if (!id) {
		res.status(400).json({error: 'Некорректный id'})
		return
	}

	const staffService = req.scope.resolve(STAFF_MODULE) as any
	const user = await resolveStaffUserFromRouteParam(staffService, id) as {
		id: string,
		email?: string | null,
		first_name?: string | null,
		last_name?: string | null,
		created_at?: string,
	} | null
	if (!user?.id) {
		res.status(404).json({error: 'User not found'})
		return
	}

	const rbacActorId = user.id

	const roleCode = await getPrimaryStaffRoleCodeForActor(req, rbacActorId)

	res.json({
		user: {
			id: user.id,
			email: user.email,
			first_name: (user as {first_name?: string | null}).first_name ?? null,
			last_name: (user as {last_name?: string | null}).last_name ?? null,
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

	const id = routeStaffUserParamId(req.params as {id?: string | string[]})
	if (!id) {
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

	const staffService = req.scope.resolve(STAFF_MODULE) as any
	const user = await resolveStaffUserFromRouteParam(staffService, id) as {id: string} | null
	if (!user?.id) {
		res.status(404).json({error: 'User not found'})
		return
	}

	const rbacActorId = user.id

	const rbacService = req.scope.resolve(RBAC_MODULE) as unknown as {
		listActorRoles: (f: unknown, c: unknown) => Promise<unknown[]>,
		deleteActorRoles: (f: unknown) => Promise<unknown>,
		createActorRoles: (rows: unknown[]) => Promise<unknown>,
		listRoles: (f: unknown, c: unknown) => Promise<unknown[]>,
	}

	const actorRoles = await rbacService.listActorRoles({
		actor_type: 'staff',
		actor_id: rbacActorId,
	}, {
		take: 50,
		relations: ['role'],
	}).catch(() => ([]))

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

	try {
		await rbacService.deleteActorRoles({
			actor_type: 'staff',
			actor_id: rbacActorId,
		})
		await rbacService.createActorRoles([{
			actor_type: 'staff',
			actor_id: rbacActorId,
			role_id: roleId,
		}])
	}
	catch (e) {
		const msg = e instanceof Error
			? e.message
			: 'Не удалось обновить роль'
		res.status(500).json({error: msg})

		return
	}

	const row = await staffService.retrieveStaffUser(rbacActorId).catch(() => null)

	res.json({
		user: {
			id: rbacActorId,
			email: row?.email ?? null,
			first_name: row?.first_name ?? null,
			last_name: row?.last_name ?? null,
			roleCode,
		},
	})
}

const DELETE = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'staff:manage')
	if (!actor) {
		return
	}

	const id = routeStaffUserParamId(req.params as {id?: string | string[]})
	if (!id) {
		res.status(400).json({error: 'Некорректный id'})
		return
	}

	const staffService = req.scope.resolve(STAFF_MODULE) as any
	const user = await resolveStaffUserFromRouteParam(staffService, id) as {id: string} | null
	if (!user?.id) {
		res.status(404).json({error: 'User not found'})
		return
	}

	const rbacActorId = user.id

	const rbacService = req.scope.resolve(RBAC_MODULE) as any
	const actorRoles = await rbacService.listActorRoles({
		actor_type: 'staff',
		actor_id: rbacActorId,
	}, {
		take: 50,
		relations: ['role'],
	}).catch(() => ([]))

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

	await staffService.deleteStaffUsers([rbacActorId]).catch(() => {})

	await rbacService.deleteActorRoles({
		actor_type: 'staff',
		actor_id: rbacActorId,
	}).catch(() => {})

	res.status(204).send()
}

export {
	DELETE, GET, PATCH,
}

