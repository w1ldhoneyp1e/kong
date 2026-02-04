import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  const pricingService = req.scope.resolve(Modules.PRICING)
  const { data } = await pricingService.listPriceLists({}, { take: 100 })
  res.json({ price_lists: data })
}
