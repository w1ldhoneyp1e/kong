import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const salesChannelService = req.scope.resolve(Modules.SALES_CHANNEL)
	const {data} = await salesChannelService.listSalesChannels({}, {take: 100})
	res.json({sales_channels: data})
}
