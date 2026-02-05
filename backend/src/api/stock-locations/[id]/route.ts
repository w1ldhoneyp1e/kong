import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const stockLocationService = req.scope.resolve(Modules.STOCK_LOCATION)
	const location = await stockLocationService.retrieveStockLocation(id).catch(() => null)
	if (!location) {
		res.status(404).json({error: 'Stock location not found'})
		return
	}
	res.json({stock_location: location})
}

export const PUT = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const stockLocationService = req.scope.resolve(Modules.STOCK_LOCATION)
	const body = req.body as Record<string, unknown>
	const [updated] = await stockLocationService.updateStockLocations([{
		id,
		...body,
	}] as never)
	res.json({stock_location: updated})
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const stockLocationService = req.scope.resolve(Modules.STOCK_LOCATION)
	const existing = await stockLocationService.retrieveStockLocation(id).catch(() => null)
	if (!existing) {
		res.status(404).json({error: 'Stock location not found'})
		return
	}
	await stockLocationService.deleteStockLocations([id])
	res.status(204).send()
}
