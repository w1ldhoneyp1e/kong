import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const stockLocationService = req.scope.resolve(Modules.STOCK_LOCATION)
	const data = await stockLocationService.listStockLocations({}, {take: 100})
	res.json({stock_locations: data})
}

const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const stockLocationService = req.scope.resolve(Modules.STOCK_LOCATION)
	const body = req.body as Record<string, unknown> | Record<string, unknown>[]
	const data = Array.isArray(body)
		? body
		: [body]
	const created = await stockLocationService.createStockLocations(data as never)
	res.status(201).json(created.length === 1
		? {stock_location: created[0]}
		: {stock_locations: created})
}

export {GET, POST}
