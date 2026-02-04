import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const customerService = req.scope.resolve(Modules.CUSTOMER)
	const data = await customerService.listCustomers({}, {take: 100})
	res.json({customers: data})
}

export const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const customerService = req.scope.resolve(Modules.CUSTOMER)
	const body = req.body as Record<string, unknown> | Record<string, unknown>[]
	const data = Array.isArray(body) ? body : [body]
	const created = await customerService.createCustomers(data as never)
	res.status(201).json(created.length === 1 ? {customer: created[0]} : {customers: created})
}
