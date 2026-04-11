import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import jwt from 'jsonwebtoken'
import {STAFF_MODULE} from '../../modules/staff'
import {getAuthHeader} from './getAuthHeader'
import {normalizeStaffActorId, resolveStaffUserFromRouteParam} from './staffActorId'
import {getStaffPermissions} from './staffPermissions'

type StaffJwtPayload = {
	actor_type: 'staff',
	actor_id: string,
}

function getJwtSecret(): string {
	return process.env.STAFF_JWT_SECRET
		?? process.env.JWT_SECRET
		?? 'supersecret'
}

function getTokenFromAuthHeader(authHeader: string | undefined): string | null {
	if (!authHeader) {
		return null
	}

	const parts = authHeader.split(' ')
	if (parts.length !== 2) {
		return null
	}

	const [scheme, token] = parts
	if (!/^bearer$/i.test(scheme)) {
		return null
	}

	return token
}

function getTokenFromCookieHeader(req: MedusaRequest, cookieName: string): string | null {
	const headers = req.headers as unknown as Record<string, string | string[]>
	const cookieHeader = headers.cookie
		?? (Array.isArray(headers.Cookie)
			? headers.Cookie.join('; ')
			: headers.Cookie)

	if (!cookieHeader || typeof cookieHeader !== 'string') {
		return null
	}

	const parts = cookieHeader.split(';').map(p => p.trim())
		.filter(Boolean)
	for (const part of parts) {
		const eqIndex = part.indexOf('=')
		if (eqIndex === -1) {
			continue
		}

		const name = part.slice(0, eqIndex)
		const value = part.slice(eqIndex + 1)
		if (name === cookieName) {
			try {
				return decodeURIComponent(value)
			}
			catch {
				return value
			}
		}
	}

	return null
}

function error(res: MedusaResponse, status: number, message: string): void {
	res.status(status).json({error: message})
}

function verifyStaffJwt(
	req: MedusaRequest,
	res: MedusaResponse,
): StaffJwtPayload | null {
	const authHeader = getAuthHeader(req)
	const tokenFromHeader = getTokenFromAuthHeader(authHeader)
	const tokenFromCookie = getTokenFromCookieHeader(req, 'kong_staff_token')
	const token = tokenFromHeader ?? tokenFromCookie
	if (!token) {
		error(res, 401, 'Необходима авторизация')
		return null
	}

	let payload: StaffJwtPayload
	try {
		payload = jwt.verify(token, getJwtSecret()) as StaffJwtPayload
	}
	catch {
		error(res, 401, 'Неверный токен')
		return null
	}

	if (payload.actor_type !== 'staff' || typeof payload.actor_id !== 'string') {
		error(res, 401, 'Неверный токен')
		return null
	}

	return payload
}

async function requirePermission(
	req: MedusaRequest,
	res: MedusaResponse,
	permissionKey: string,
): Promise<StaffJwtPayload | null> {
	const payload = verifyStaffJwt(req, res)
	if (!payload) {
		return null
	}

	const staffService = req.scope.resolve(STAFF_MODULE) as any
	const staffUser = await resolveStaffUserFromRouteParam(staffService, payload.actor_id) as {id?: string} | null
	const rbacActorId = staffUser?.id ?? normalizeStaffActorId(payload.actor_id)

	const perms = await getStaffPermissions(req, rbacActorId).catch(() => [])
	if (!perms.includes(permissionKey)) {
		error(res, 403, 'Недостаточно прав')
		return null
	}

	return {
		actor_type: payload.actor_type,
		actor_id: rbacActorId,
	}
}

export {
	error,
	getAuthHeader,
	getJwtSecret,
	getTokenFromAuthHeader,
	requirePermission,
	verifyStaffJwt,
}

