import {type MedusaRequest} from '@medusajs/framework'
import {RBAC_MODULE} from '../../modules/rbac'

function asString(value: unknown): string | null {
	if (typeof value === 'string' && value.length > 0) {
		return value
	}

	return null
}

function extractRoleIdFromActorRole(actorRole: any): string | null {
	return asString(actorRole?.role_id)
		?? asString(actorRole?.role?.id)
}

function extractRoleIdFromRolePermission(rolePermission: any): string | null {
	return asString(rolePermission?.role_id)
		?? asString(rolePermission?.role?.id)
}

function extractPermissionId(rolePermission: any): string | null {
	return asString(rolePermission?.permission_id)
		?? asString(rolePermission?.permission?.id)
}

function extractPermissionKey(permission: any): string | null {
	return asString(permission?.key)
}

async function getStaffPermissions(
	req: MedusaRequest,
	actorId: string,
): Promise<string[]> {
	const rbacService = req.scope.resolve(RBAC_MODULE) as any

	const actorRoles = await rbacService.listActorRoles({
		actor_type: 'staff',
		actor_id: actorId,
	}).catch(() => ([]))

	const actorRoleList = Array.isArray(actorRoles)
		? actorRoles
		: []
	const roleIds = actorRoleList
		.map(r => extractRoleIdFromActorRole(r))
		.filter((v): v is string => typeof v === 'string')

	if (roleIds.length === 0) {
		return []
	}

	const rolePermissions = await rbacService.listRolePermissions({}, {take: 2000}).catch(() => ([]))
	const filteredRolePermissions = (Array.isArray(rolePermissions)
		? rolePermissions
		: [])
		.filter(rp => {
			const roleId = extractRoleIdFromRolePermission(rp)
			return roleId
				? roleIds.includes(roleId)
				: false
		})

	const permissionIds = filteredRolePermissions
		.map(rp => extractPermissionId(rp))
		.filter((v): v is string => typeof v === 'string')

	const permissions = await rbacService.listPermissions({}, {take: 2000}).catch(() => ([]))
	const keys = (Array.isArray(permissions)
		? permissions
		: [])
		.filter(p => permissionIds.includes(p.id))
		.map(p => extractPermissionKey(p))
		.filter((v): v is string => typeof v === 'string')

	return Array.from(new Set(keys))
}

export {
	getStaffPermissions,
}
