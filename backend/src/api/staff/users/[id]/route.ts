import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {RBAC_MODULE} from '../../../../modules/rbac'
import {STAFF_MODULE} from '../../../../modules/staff'
import {requirePermission} from '../../../_shared/staffAuth'

function normalizeActorId(id: string): string {
	return id.trim().toLowerCase()
}

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'staff:manage')
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
		},
	})
}

const DELETE = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'staff:manage')
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

export {GET, DELETE}

