import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  res.json({
    message: "Kong Store API",
    version: "1.0.0",
    status: "ok",
  })
}

