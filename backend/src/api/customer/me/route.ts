import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {getAuthContextFromJwtToken} from '@medusajs/framework/http'
import {ContainerRegistrationKeys, Modules} from '@medusajs/framework/utils'
import {getAuthHeader} from '../../_shared/staffAuth'

type ConfigModule = {
	projectConfig: {
		http: {
			jwtSecret: string,
			jwtPublicKey?: string,
			jwtVerifyOptions?: import('jsonwebtoken').VerifyOptions,
			jwtOptions?: import('jsonwebtoken').VerifyOptions,
		},
	},
}

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {
		projectConfig: {http},
	} = req.scope.resolve(ContainerRegistrationKeys.CONFIG_MODULE) as ConfigModule

	const authContext = getAuthContextFromJwtToken(
		getAuthHeader(req),
		http.jwtSecret,
		['bearer'],
		['customer'],
		http.jwtPublicKey,
		http.jwtVerifyOptions ?? http.jwtOptions,
	)

	if (!authContext?.actor_id) {
		res.status(401).json({error: 'Необходима авторизация клиента'})
		return
	}

	const customerService = req.scope.resolve(Modules.CUSTOMER) as {
		retrieveCustomer: (id: string) => Promise<{id: string, email?: string | null} | null>,
	}
	const customer = await customerService.retrieveCustomer(authContext.actor_id).catch(() => null)
	if (!customer) {
		res.status(404).json({error: 'Customer not found'})
		return
	}

	res.json({
		customer: {
			id: customer.id,
			email: customer.email ?? null,
		},
	})
}

export {GET}
