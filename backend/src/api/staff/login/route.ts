import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {RBAC_MODULE} from '../../../modules/rbac'
import {STAFF_MODULE} from '../../../modules/staff'

function normalizeEmail(email: string): string {
	return email.trim().toLowerCase()
}

async function ensureOwnerUser(
	req: MedusaRequest,
	email: string,
): Promise<void> {
	const ownerEmail = process.env.OWNER_EMAIL
	if (!ownerEmail) {
		return
	}
	if (normalizeEmail(ownerEmail) !== email) {
		return
	}

	const staffService = req.scope.resolve(STAFF_MODULE) as any
	const existing = await staffService.listStaffUsers({email}, {take: 1}).catch(() => ([]))
	if (Array.isArray(existing) && existing.length > 0) {
		return
	}

	let passwordHash = process.env.OWNER_PASSWORD_HASH
	const ownerPassword = process.env.OWNER_PASSWORD
	if (!passwordHash && ownerPassword) {
		passwordHash = await bcrypt.hash(ownerPassword, 12)
	}

	if (!passwordHash) {
		throw new Error('Для OWNER_EMAIL нужно задать OWNER_PASSWORD или OWNER_PASSWORD_HASH')
	}

	await staffService.createStaffUsers([{
		id: email,
		email,
		password_hash: passwordHash,
	}]).catch(() => {})

	const rbacService = req.scope.resolve(RBAC_MODULE) as any

	const ownerRoles = await rbacService.listRoles({}, {take: 200}).catch(() => ([]))
	const ownerRole = (Array.isArray(ownerRoles)
		? ownerRoles
		: [])
		.find((r: any) => r?.code === 'owner') ?? null
	if (!ownerRole?.id) {
		return
	}

	await rbacService.createActorRoles([{
		actor_type: 'staff',
		actor_id: email,
		role_id: ownerRole.id,
	}]).catch(() => {})
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

	const roleIds = (actorRoles as any[]).map(r => r.role_id ?? r.role?.id).filter((v: unknown) => typeof v === 'string')
	if (!roleIds.length) {
		return []
	}

	const rolePermissions = await rbacService.listRolePermissions({}, {take: 2000}).catch(() => ([]))
	const filteredRolePermissions = (Array.isArray(rolePermissions)
		? rolePermissions
		: [])
		.filter(rp => roleIds.includes(rp.role_id ?? rp.role?.id))

	const permissionIds = filteredRolePermissions
		.map(rp => rp.permission_id ?? rp.permission?.id)
		.filter((v: unknown) => typeof v === 'string')
	if (!permissionIds.length) {
		return []
	}

	const permissions = await rbacService.listPermissions({}, {take: 2000}).catch(() => ([]))
	const keys = (Array.isArray(permissions)
		? permissions
		: [])
		.filter(p => permissionIds.includes(p.id))
		.map(p => p.key)
		.filter((v: unknown) => typeof v === 'string')
	return keys
}

const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const body = req.body as {
		email?: string,
		password?: string,
	} | undefined
	const emailRaw = body?.email
	const password = body?.password

	if (!emailRaw || typeof emailRaw !== 'string' || !password || typeof password !== 'string') {
		res.status(400).json({error: 'Не задан email или password'})
		return
	}

	const email = normalizeEmail(emailRaw)

	await ensureOwnerUser(req, email)

	const staffService = req.scope.resolve(STAFF_MODULE) as any
	const users = await staffService.listStaffUsers({email}, {take: 1}).catch(() => ([]))
	const user = Array.isArray(users)
		? users[0]
		: null
	if (!user?.id || !user?.password_hash) {
		res.status(401).json({error: 'Неверные учетные данные'})
		return
	}

	const ok = await bcrypt.compare(password, user.password_hash).catch(() => false)
	if (!ok) {
		res.status(401).json({error: 'Неверные учетные данные'})
		return
	}

	const permissions = await getStaffPermissions(req, user.id).catch(() => [])

	const secret = process.env.STAFF_JWT_SECRET ?? process.env.JWT_SECRET ?? 'supersecret'

	const token = jwt.sign({
		actor_type: 'staff',
		actor_id: user.id,
		permissions,
	}, secret, {expiresIn: '8h'})

	res.json({token})
}

export {POST}

