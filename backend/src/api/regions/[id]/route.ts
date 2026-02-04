import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  const { id } = req.params
  const regionService = req.scope.resolve(Modules.REGION)
  const region = await regionService.retrieveRegion(id).catch(() => null)
  if (!region) {
    res.status(404).json({ error: "Region not found" })
    return
  }
  res.json({ region })
}
