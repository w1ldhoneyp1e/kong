import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const inventoryService = req.scope.resolve(Modules.INVENTORY)
	const item = await inventoryService.retrieveInventoryItem(id).catch(() => null)
	if (!item) {
		res.status(404).json({error: 'Inventory item not found'})
		return
	}
	res.json({inventory_item: item})
}

const PUT = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const inventoryService = req.scope.resolve(Modules.INVENTORY)
	const body = req.body as Record<string, unknown>
	const [updated] = await inventoryService.updateInventoryItems([{
		id,
		...body,
	}] as never)
	res.json({inventory_item: updated})
}

const DELETE = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const inventoryService = req.scope.resolve(Modules.INVENTORY)
	const existing = await inventoryService.retrieveInventoryItem(id).catch(() => null)
	if (!existing) {
		res.status(404).json({error: 'Inventory item not found'})
		return
	}
	await inventoryService.deleteInventoryItems([id])
	res.status(204).send()
}

export {
	DELETE, GET, PUT,
}
