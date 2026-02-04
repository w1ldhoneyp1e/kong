import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const inventoryService = req.scope.resolve(Modules.INVENTORY)
	const {data} = await inventoryService.listInventoryItems({}, {take: 100})
	res.json({inventory_items: data})
}
