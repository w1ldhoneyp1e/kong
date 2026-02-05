import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const pricingService = req.scope.resolve(Modules.PRICING)
	const priceList = await pricingService.retrievePriceList(id).catch(() => null)
	if (!priceList) {
		res.status(404).json({error: 'Price list not found'})
		return
	}
	res.json({price_list: priceList})
}

const PUT = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const pricingService = req.scope.resolve(Modules.PRICING)
	const body = req.body as Record<string, unknown>
	const [updated] = await pricingService.updatePriceLists([{
		id,
		...body,
	}] as never)
	res.json({price_list: updated})
}

const DELETE = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const pricingService = req.scope.resolve(Modules.PRICING)
	const existing = await pricingService.retrievePriceList(id).catch(() => null)
	if (!existing) {
		res.status(404).json({error: 'Price list not found'})
		return
	}
	await pricingService.deletePriceLists([id])
	res.status(204).send()
}

export {
	DELETE, GET, PUT,
}
