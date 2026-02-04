import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  const { id } = req.params
  const stockLocationService = req.scope.resolve(Modules.STOCK_LOCATION)
  const location = await stockLocationService.retrieveStockLocation(id).catch(() => null)
  if (!location) {
    res.status(404).json({ error: "Stock location not found" })
    return
  }
  res.json({ stock_location: location })
}
