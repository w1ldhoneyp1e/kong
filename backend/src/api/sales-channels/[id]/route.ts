import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const salesChannelService = req.scope.resolve(Modules.SALES_CHANNEL)
	const salesChannel = await salesChannelService.retrieveSalesChannel(id).catch(() => null)
	if (!salesChannel) {
		res.status(404).json({error: 'Sales channel not found'})
		return
	}
	res.json({sales_channel: salesChannel})
}
