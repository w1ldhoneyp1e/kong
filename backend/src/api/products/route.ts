import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  const productService = req.scope.resolve(Modules.PRODUCT)
  const { data } = await productService.listProducts({}, { take: 50 })
  res.json({ products: data })
}
