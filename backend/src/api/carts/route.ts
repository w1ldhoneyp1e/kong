import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  const cartService = req.scope.resolve(Modules.CART)
  const { data } = await cartService.listCarts({}, { take: 100 })
  res.json({ carts: data })
}
