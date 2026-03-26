import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import jwt from 'jsonwebtoken'

type StaffJwtPayload = {
	actor_type: 'staff',
	actor_id: string,
	permissions?: string[],
}

function getJwtSecret(): string {
	return process.env.STAFF_JWT_SECRET
		?? process.env.JWT_SECRET
		?? 'supersecret'
}

function getAuthHeader(req: MedusaRequest): string | undefined {
	const headers = req.headers as unknown as Record<string, string>
	return headers.authorization ?? headers.Authorization
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

function error(res: MedusaResponse, status: number, message: string): void {
	res.status(status).json({error: message})
}

function verifyStaffJwt(
	req: MedusaRequest,
	res: MedusaResponse,
): StaffJwtPayload | null {
	const authHeader = getAuthHeader(req)
	const token = getTokenFromAuthHeader(authHeader)
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

function requirePermission(
	req: MedusaRequest,
	res: MedusaResponse,
	permissionKey: string,
): StaffJwtPayload | null {
	const payload = verifyStaffJwt(req, res)
	if (!payload) {
		return null
	}

	const perms = payload.permissions ?? []
	if (!perms.includes(permissionKey)) {
		error(res, 403, 'Недостаточно прав')
		return null
	}

	return payload
}

export {
	error,
	getJwtSecret,
	getTokenFromAuthHeader,
	requirePermission,
	verifyStaffJwt,
}

