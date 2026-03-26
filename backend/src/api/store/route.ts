import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {requirePermission} from '../_shared/staffAuth'

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'store:update')
	if (!actor) {
		return
	}

	const storeService = req.scope.resolve(Modules.STORE)
	const [store] = await storeService.listStores({}, {take: 1})
	if (!store) {
		res.status(404).json({error: 'Store not found'})
		return
	}
	res.json({store})
}

const PUT = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'store:update')
	if (!actor) {
		return
	}

	const storeService = req.scope.resolve(Modules.STORE)
	const [store] = await storeService.listStores({}, {take: 1})
	if (!store) {
		res.status(404).json({error: 'Store not found'})
		return
	}
	const body = req.body as Record<string, unknown>
	const updated = await storeService.updateStores(store.id, body as never)
	res.json({store: updated})
}

export {GET, PUT}
