import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const currencyService = req.scope.resolve(Modules.CURRENCY)
	const data = await currencyService.listCurrencies({}, {take: 100})
	res.json({currencies: data})
}
