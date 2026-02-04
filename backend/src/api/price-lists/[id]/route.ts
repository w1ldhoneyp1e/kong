import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  const { id } = req.params
  const pricingService = req.scope.resolve(Modules.PRICING)
  const priceList = await pricingService.retrievePriceList(id).catch(() => null)
  if (!priceList) {
    res.status(404).json({ error: "Price list not found" })
    return
  }
  res.json({ price_list: priceList })
}
