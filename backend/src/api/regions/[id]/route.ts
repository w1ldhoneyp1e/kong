import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {requirePermission} from '../../_shared/staffAuth'

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'geo:manage')
	if (!actor) {
		return
	}

	const {id} = req.params
	const regionService = req.scope.resolve(Modules.REGION)
	const region = await regionService.retrieveRegion(id).catch(() => null)
	if (!region) {
		res.status(404).json({error: 'Region not found'})
		return
	}
	res.json({region})
}

const PUT = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'geo:manage')
	if (!actor) {
		return
	}

	const {id} = req.params
	const regionService = req.scope.resolve(Modules.REGION)
	const body = req.body as Record<string, unknown>
	const updated = await regionService.updateRegions(id, body as never)
	res.json({region: updated})
}

const DELETE = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'geo:manage')
	if (!actor) {
		return
	}

	const {id} = req.params
	const regionService = req.scope.resolve(Modules.REGION)
	const existing = await regionService.retrieveRegion(id).catch(() => null)
	if (!existing) {
		res.status(404).json({error: 'Region not found'})
		return
	}
	await regionService.deleteRegions([id])
	res.status(204).send()
}

export {
	DELETE, GET, PUT,
}
