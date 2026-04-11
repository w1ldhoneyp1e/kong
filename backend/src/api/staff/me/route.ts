import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {RBAC_MODULE} from '../../../modules/rbac'
import {STAFF_MODULE} from '../../../modules/staff'
import {verifyStaffJwt} from '../../_shared/staffAuth'
import {normalizeStaffActorId, resolveStaffUserFromRouteParam} from '../../_shared/staffActorId'
import {getStaffPermissions} from '../../_shared/staffPermissions'

function asString(value: unknown): string | null {
	if (typeof value === 'string' && value.length > 0) {
		return value
	}

	return null
}

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const payload = verifyStaffJwt(req, res)
	if (!payload) {
		return
	}

	const staffService = req.scope.resolve(STAFF_MODULE) as any
	const staffUser = await resolveStaffUserFromRouteParam(staffService, payload.actor_id) as {
		id: string,
		email?: string | null,
	} | null
	const rbacActorId = staffUser?.id ?? normalizeStaffActorId(payload.actor_id)

	const rbacService = req.scope.resolve(RBAC_MODULE) as any
	const actorRoles = await rbacService.listActorRoles({
		actor_type: 'staff',
		actor_id: rbacActorId,
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

	const permissions = await getStaffPermissions(req, rbacActorId).catch(() => [])

	res.json({
		staff: {
			id: staffUser?.id ?? rbacActorId,
			email: staffUser?.email ?? null,
			roleCode,
			roles: roleCodes,
		},
		permissions,
	})
}

export {GET}

