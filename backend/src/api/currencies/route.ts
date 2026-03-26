import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {requirePermission} from '../_shared/staffAuth'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'geo:manage')
	if (!actor) {
		return
	}

	const currencyService = req.scope.resolve(Modules.CURRENCY)
	const data = await currencyService.listCurrencies({}, {take: 100})
	res.json({currencies: data})
}
