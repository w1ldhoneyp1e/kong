import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

const categories = [
  { id: "1", name: "Электроника", slug: "electronics" },
  { id: "2", name: "Одежда", slug: "clothing" },
  { id: "3", name: "Книги", slug: "books" },
]

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  res.json({
    categories,
  })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { name, slug } = req.body

  if (!name || !slug) {
    return res.status(400).json({
      error: "name и slug обязательны",
    })
  }

  const newCategory = {
    id: String(categories.length + 1),
    name,
    slug,
  }

  categories.push(newCategory)

  res.status(201).json({
    category: newCategory,
  })
}




