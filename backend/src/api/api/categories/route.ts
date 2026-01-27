import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

const categories = [
  { id: "1", name: "Электроника", slug: "electronics" },
  { id: "2", name: "Одежда", slug: "clothing" },
  { id: "3", name: "Книги", slug: "books" },
]

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  res.json({
    categories,
  })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  const { name, slug } = (req.body as { name?: string; slug?: string }) || {}

  if (!name || !slug) {
    res.status(400).json({
      error: "name и slug обязательны",
    })
    return
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




