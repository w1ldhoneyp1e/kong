import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {requirePermission} from '../_shared/staffAuth'

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'geo:manage')
	if (!actor) {
		return
	}

	const salesChannelService = req.scope.resolve(Modules.SALES_CHANNEL)
	const data = await salesChannelService.listSalesChannels({}, {take: 100})
	res.json({sales_channels: data})
}

const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'geo:manage')
	if (!actor) {
		return
	}

	const salesChannelService = req.scope.resolve(Modules.SALES_CHANNEL)
	const body = req.body as Record<string, unknown> | Record<string, unknown>[]
	const data = Array.isArray(body)
		? body
		: [body]
	const created = await salesChannelService.createSalesChannels(data as never)
	res.status(201).json(created.length === 1
		? {sales_channel: created[0]}
		: {sales_channels: created})
}

export {GET, POST}
