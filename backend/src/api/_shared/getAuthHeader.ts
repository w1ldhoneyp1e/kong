import {type MedusaRequest} from '@medusajs/framework'

function getAuthHeader(req: MedusaRequest): string | undefined {
	const headers = req.headers as unknown as Record<string, string>
	return headers.authorization ?? headers.Authorization
}

export {getAuthHeader}
