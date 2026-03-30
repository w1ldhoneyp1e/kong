import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import bcrypt from 'bcryptjs'
import {RBAC_MODULE} from '../../../modules/rbac'
import {STAFF_MODULE} from '../../../modules/staff'
import {requirePermission} from '../../_shared/staffAuth'
import {getStaffPermissions} from '../../_shared/staffPermissions'

type CreateStaffBody = {
	email?: string,
	password?: string,
	roleCode?: string,
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

	if (!userExists) {
		await staffService.createStaffUsers([{
			id: email,
			email,
			password_hash: passwordHash,
		}]).catch(() => {})
	}

	const roleId = await getRoleIdByCode(req, roleCode)
	if (!roleId) {
		res.status(500).json({error: 'Роль не найдена'})
		return
	}

	const rbacService = req.scope.resolve(RBAC_MODULE) as any
	await rbacService.createActorRoles([{
		actor_type: 'staff',
		actor_id: email,
		role_id: roleId,
	}]).catch(() => {})

	res.status(201).json({
		id: email,
		email,
		roleCode,
	})
}

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'staff:manage')
	if (!actor) {
		return
	}

	const staffService = req.scope.resolve(STAFF_MODULE) as any
	const users = await staffService.listStaffUsers({}, {take: 100}).catch(() => ([]))
	const staffUsers = Array.isArray(users)
		? users
		: []

	const rbacService = req.scope.resolve(RBAC_MODULE) as any
	const enriched = await Promise.all(staffUsers.map(async (u: any) => {
		const actorRoles = await rbacService.listActorRoles({
			actor_type: 'staff',
			actor_id: u.id,
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

		return {
			id: u.id,
			email: u.email,
			roleCode,
		}
	}))

	res.json({users: enriched})
}

export {GET, POST}

