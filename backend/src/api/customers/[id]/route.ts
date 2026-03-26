import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {requirePermission} from '../../_shared/staffAuth'

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'customers:manage')
	if (!actor) {
		return
	}

	const {id} = req.params
	const customerService = req.scope.resolve(Modules.CUSTOMER)
	const customer = await customerService.retrieveCustomer(id).catch(() => null)
	if (!customer) {
		res.status(404).json({error: 'Customer not found'})
		return
	}
	res.json({customer})
}

const PUT = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'customers:manage')
	if (!actor) {
		return
	}

	const {id} = req.params
	const customerService = req.scope.resolve(Modules.CUSTOMER)
	const body = req.body as Record<string, unknown>
	const updated = await customerService.updateCustomers(id, body as never)
	res.json({customer: updated})
}

const DELETE = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'customers:manage')
	if (!actor) {
		return
	}

	const {id} = req.params
	const customerService = req.scope.resolve(Modules.CUSTOMER)
	const existing = await customerService.retrieveCustomer(id).catch(() => null)
	if (!existing) {
		res.status(404).json({error: 'Customer not found'})
		return
	}
	await customerService.deleteCustomers([id])
	res.status(204).send()
}

export {
	DELETE, GET, PUT,
}
