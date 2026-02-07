import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const salesChannelService = req.scope.resolve(Modules.SALES_CHANNEL)
	const salesChannel = await salesChannelService.retrieveSalesChannel(id).catch(() => null)
	if (!salesChannel) {
		res.status(404).json({error: 'Sales channel not found'})
		return
	}
	res.json({sales_channel: salesChannel})
}

const PUT = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const salesChannelService = req.scope.resolve(Modules.SALES_CHANNEL)
	const body = req.body as Record<string, unknown>
	const updated = await salesChannelService.updateSalesChannels(id, body as never)
	res.json({sales_channel: updated})
}

const DELETE = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const salesChannelService = req.scope.resolve(Modules.SALES_CHANNEL)
	const existing = await salesChannelService.retrieveSalesChannel(id).catch(() => null)
	if (!existing) {
		res.status(404).json({error: 'Sales channel not found'})
		return
	}
	await salesChannelService.deleteSalesChannels([id])
	res.status(204).send()
}

export {
	DELETE, GET, PUT,
}
