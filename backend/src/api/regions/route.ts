import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {requirePermission} from '../_shared/staffAuth'

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'geo:manage')
	if (!actor) {
		return
	}

	const regionService = req.scope.resolve(Modules.REGION)
	const data = await regionService.listRegions({}, {take: 100})
	res.json({regions: data})
}

const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'geo:manage')
	if (!actor) {
		return
	}

	const regionService = req.scope.resolve(Modules.REGION)
	const body = req.body as Record<string, unknown> | Record<string, unknown>[]
	const data = Array.isArray(body)
		? body
		: [body]
	const created = await regionService.createRegions(data as never)
	res.status(201).json(created.length === 1
		? {region: created[0]}
		: {regions: created})
}

export {GET, POST}
