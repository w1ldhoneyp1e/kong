import {type MedusaRequest} from '@medusajs/framework'
import {ContainerRegistrationKeys, Modules} from '@medusajs/framework/utils'

type SalesChannelRecord = {
	id: string,
	is_disabled?: boolean,
}

type LinkService = {
	create: (links: unknown[]) => Promise<unknown>,
}

async function getDefaultSalesChannelId(req: MedusaRequest): Promise<string | null> {
	const salesChannelService = req.scope.resolve(Modules.SALES_CHANNEL) as {
		listSalesChannels: (
			filters?: Record<string, unknown>,
			config?: {take?: number},
		) => Promise<SalesChannelRecord[]>,
	}
	const channels = await salesChannelService.listSalesChannels({}, {take: 1})
	const channel = channels.find(item => !item.is_disabled) ?? channels[0]

	return channel?.id ?? null
}

async function attachProductsToDefaultSalesChannel(
	req: MedusaRequest,
	productIds: string[],
): Promise<void> {
	const ids = productIds.filter(id => id.trim().length > 0)
	if (ids.length === 0) {
		return
	}

	const salesChannelId = await getDefaultSalesChannelId(req)
	if (!salesChannelId) {
		return
	}

	const link = req.scope.resolve(ContainerRegistrationKeys.LINK) as LinkService
	await link.create(ids.map(productId => ({
		[Modules.PRODUCT]: {
			product_id: productId,
		},
		[Modules.SALES_CHANNEL]: {
			sales_channel_id: salesChannelId,
		},
	}))).catch(() => undefined)
}

export {attachProductsToDefaultSalesChannel}
