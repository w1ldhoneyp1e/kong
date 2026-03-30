import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {requirePermission} from '../_shared/staffAuth'

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'inventory:manage')
	if (!actor) {
		return
	}

	const stockLocationService = req.scope.resolve(Modules.STOCK_LOCATION)
	const data = await stockLocationService.listStockLocations({}, {take: 100})
	res.json({stock_locations: data})
}

const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'inventory:manage')
	if (!actor) {
		return
	}

	const stockLocationService = req.scope.resolve(Modules.STOCK_LOCATION)
	const body = req.body as Record<string, unknown> | Record<string, unknown>[]
	const data = Array.isArray(body)
		? body
		: [body]
	const created = await stockLocationService.createStockLocations(data as never)
	const list = Array.isArray(created)
		? created
		: [created]
	res.status(201).json(list.length === 1
		? {stock_location: list[0]}
		: {stock_locations: list})
}

export {GET, POST}
