import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  const regionService = req.scope.resolve(Modules.REGION)
  const { data } = await regionService.listRegions({}, { take: 100 })
  res.json({ regions: data })
}
