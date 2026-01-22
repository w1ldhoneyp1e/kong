import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

const products = [
  { id: "1", name: "Товар 1", price: 1990, description: "Тестовый товар 1" },
  { id: "2", name: "Товар 2", price: 2990, description: "Тестовый товар 2" },
  { id: "3", name: "Товар 3", price: 3990, description: "Тестовый товар 3" },
]

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  res.json({
    products,
  })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { name, price, description } = req.body

  const newProduct = {
    id: String(products.length + 1),
    name,
    price,
    description,
  }

  products.push(newProduct)

  res.json({
    product: newProduct,
  })
}

