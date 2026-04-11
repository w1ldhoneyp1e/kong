import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {requirePermission} from '../_shared/staffAuth'

type CustomerModuleLike = {
	listAndCountCustomers?: (
		filters: unknown,
		config: unknown,
	) => Promise<[unknown[], number]>,
	listCustomers: (
		filters: unknown,
		config: unknown,
	) => Promise<unknown[]>,
}

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'customers:manage')
	if (!actor) {
		return
	}

	const customerService = req.scope.resolve(
		Modules.CUSTOMER,
	) as CustomerModuleLike
	const q = typeof req.query['q'] === 'string'
		? req.query['q']
		: undefined
	const limitRaw = req.query['limit']
	const offsetRaw = req.query['offset']

	const limit = Math.min(
		Math.max(1, parseInt(String(limitRaw ?? '50'), 10) || 50),
		100,
	)
	const offset = Math.max(0, parseInt(String(offsetRaw ?? '0'), 10) || 0)

	const filters: Record<string, unknown> = {}

	if (q?.trim()) {
		const t = q.trim()
		filters.$or = [
			{email: {$ilike: `%${t}%`}},
			{first_name: {$ilike: `%${t}%`}},
			{last_name: {$ilike: `%${t}%`}},
		]
	}

	const config = {
		take: limit,
		skip: offset,
		order: {created_at: 'DESC'},
	}

	if (typeof customerService.listAndCountCustomers === 'function') {
		const [customers, count] = await customerService.listAndCountCustomers(
			filters,
			config,
		)
		res.json({
			customers,
			count,
		})

		return
	}

	const customers = await customerService.listCustomers(filters, config)
	res.json({
		customers,
		count: customers.length,
	})
}

const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'customers:manage')
	if (!actor) {
		return
	}

	const customerService = req.scope.resolve(Modules.CUSTOMER)
	const body = req.body as Record<string, unknown> | Record<string, unknown>[]
	const data = Array.isArray(body)
		? body
		: [body]
	const created = await customerService.createCustomers(data as never)
	res.status(201).json(created.length === 1
		? {customer: created[0]}
		: {customers: created})
}

export {GET, POST}
