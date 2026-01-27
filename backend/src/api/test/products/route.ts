import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

const products = [
  { id: "1", name: "Товар 1", price: 1990, description: "Тестовый товар 1" },
  { id: "2", name: "Товар 2", price: 2990, description: "Тестовый товар 2" },
  { id: "3", name: "Товар 3", price: 3990, description: "Тестовый товар 3" },
]

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  res.json({
    products,
  })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  const { name, price, description } = (req.body as { name?: string; price?: number; description?: string }) || {}

  const newProduct = {
    id: String(products.length + 1),
    name: name || "",
    price: price || 0,
    description: description || "",
  }

  products.push(newProduct)

  res.json({
    product: newProduct,
  })
}

