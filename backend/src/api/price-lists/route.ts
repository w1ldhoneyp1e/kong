import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const pricingService = req.scope.resolve(Modules.PRICING)
	const data = await pricingService.listPriceLists({}, {take: 100})
	res.json({price_lists: data})
}

export const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const pricingService = req.scope.resolve(Modules.PRICING)
	const body = req.body as Record<string, unknown> | Record<string, unknown>[]
	const data = Array.isArray(body)
		? body
		: [body]
	const created = await pricingService.createPriceLists(data as never)
	res.status(201).json(created.length === 1
		? {price_list: created[0]}
		: {price_lists: created})
}
