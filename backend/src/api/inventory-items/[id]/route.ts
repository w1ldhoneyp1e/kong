import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const inventoryService = req.scope.resolve(Modules.INVENTORY)
	const item = await inventoryService.retrieveInventoryItem(id).catch(() => null)
	if (!item) {
		res.status(404).json({error: 'Inventory item not found'})
		return
	}
	res.json({inventory_item: item})
}
