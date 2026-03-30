import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {RBAC_MODULE} from '../../../modules/rbac'
import {STAFF_MODULE} from '../../../modules/staff'
import {verifyStaffJwt} from '../../_shared/staffAuth'
import {getStaffPermissions} from '../../_shared/staffPermissions'

function asString(value: unknown): string | null {
	if (typeof value === 'string' && value.length > 0) {
		return value
	}

	return null
}

function normalizeActorId(id: string): string {
	return id.trim().toLowerCase()
}

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const payload = verifyStaffJwt(req, res)
	if (!payload) {
		return
	}

	const actorId = normalizeActorId(payload.actor_id)

	const staffService = req.scope.resolve(STAFF_MODULE) as any
	const staffUsers = await staffService.listStaffUsers({id: actorId}, {take: 1}).catch(() => ([]))
	const staffUser = Array.isArray(staffUsers)
		? staffUsers[0]
		: null

	const rbacService = req.scope.resolve(RBAC_MODULE) as any
	const actorRoles = await rbacService.listActorRoles({
		actor_type: 'staff',
		actor_id: actorId,
	}, {take: 50}).catch(() => ([]))

	const roleCodesFromRelations = (Array.isArray(actorRoles)
		? actorRoles
		: [])
		.map((ar: any) => asString(ar.role?.code))
		.filter((v): v is string => typeof v === 'string')

	const roleIds = (Array.isArray(actorRoles)
		? actorRoles
		: [])
		.map((ar: any) => asString(ar.role_id) ?? asString(ar.role?.id))
		.filter((v): v is string => typeof v === 'string')

	const roles = await rbacService.listRoles({}, {take: 2000}).catch(() => ([]))
	const roleCodeById = new Map<string, string>()
	if (Array.isArray(roles)) {
		for (const role of roles) {
			const id = asString(role?.id)
			const code = asString(role?.code)
			if (id && code) {
				roleCodeById.set(id, code)
			}
		}
	}

	const roleCodesSet = new Set<string>(roleCodesFromRelations)
	for (const roleId of roleIds) {
		const code = roleCodeById.get(roleId)
		if (code) {
			roleCodesSet.add(code)
		}
	}

	const roleCodes = Array.from(roleCodesSet)

	const roleCode = roleCodes.includes('owner')
		? 'owner'
		: roleCodes.includes('admin')
			? 'admin'
			: roleCodes.includes('manager')
				? 'manager'
				: roleCodes[0] ?? null

	const permissions = await getStaffPermissions(req, actorId).catch(() => [])

	res.json({
		staff: {
			id: staffUser?.id ?? actorId,
			email: staffUser?.email ?? null,
			roleCode,
			roles: roleCodes,
		},
		permissions,
	})
}

export {GET}

