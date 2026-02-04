import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  const { id } = req.params
  const orderService = req.scope.resolve(Modules.ORDER)
  const order = await orderService.retrieveOrder(id).catch(() => null)
  if (!order) {
    res.status(404).json({ error: "Order not found" })
    return
  }
  res.json({ order })
}
