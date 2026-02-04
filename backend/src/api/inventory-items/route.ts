import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const inventoryService = req.scope.resolve(Modules.INVENTORY)
	const data = await inventoryService.listInventoryItems({}, {take: 100})
	res.json({inventory_items: data})
}

export const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const inventoryService = req.scope.resolve(Modules.INVENTORY)
	const body = req.body as Record<string, unknown> | Record<string, unknown>[]
	const data = Array.isArray(body) ? body : [body]
	const created = await inventoryService.createInventoryItems(data as never)
	res.status(201).json(created.length === 1 ? {inventory_item: created[0]} : {inventory_items: created})
}
