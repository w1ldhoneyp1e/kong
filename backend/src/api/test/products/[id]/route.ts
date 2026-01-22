import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

const products = [
  { id: "1", name: "Товар 1", price: 1990, description: "Тестовый товар 1" },
  { id: "2", name: "Товар 2", price: 2990, description: "Тестовый товар 2" },
  { id: "3", name: "Товар 3", price: 3990, description: "Тестовый товар 3" },
]

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const product = products.find((p) => p.id === id)

  if (!product) {
    return res.status(404).json({ error: "Товар не найден" })
  }

  res.json({ product })
}

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const { name, price, description } = req.body

  const productIndex = products.findIndex((p) => p.id === id)

  if (productIndex === -1) {
    return res.status(404).json({ error: "Товар не найден" })
  }

  products[productIndex] = {
    ...products[productIndex],
    name: name || products[productIndex].name,
    price: price || products[productIndex].price,
    description: description || products[productIndex].description,
  }

  res.json({ product: products[productIndex] })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const productIndex = products.findIndex((p) => p.id === id)

  if (productIndex === -1) {
    return res.status(404).json({ error: "Товар не найден" })
  }

  const deletedProduct = products.splice(productIndex, 1)[0]

  res.json({ product: deletedProduct })
}

