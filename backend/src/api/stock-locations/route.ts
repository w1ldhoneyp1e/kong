import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const stockLocationService = req.scope.resolve(Modules.STOCK_LOCATION)
	const {data} = await stockLocationService.listStockLocations({}, {take: 100})
	res.json({stock_locations: data})
}
