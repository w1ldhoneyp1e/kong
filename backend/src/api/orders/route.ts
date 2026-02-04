import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  const orderService = req.scope.resolve(Modules.ORDER)
  const { data } = await orderService.listOrders({}, { take: 100 })
  res.json({ orders: data })
}
