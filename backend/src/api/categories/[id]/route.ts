import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

const categories = [
  { id: "1", name: "Электроника", slug: "electronics" },
  { id: "2", name: "Одежда", slug: "clothing" },
  { id: "3", name: "Книги", slug: "books" },
]

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  const { id } = req.params

  const category = categories.find((c) => c.id === id)

  if (!category) {
    res.status(404).json({
      error: "Категория не найдена",
    })
    return
  }

  res.json({
    category,
  })
}

export const PUT = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  const { id } = req.params
  const { name, slug } = (req.body as { name?: string; slug?: string }) || {}

  const categoryIndex = categories.findIndex((c) => c.id === id)

  if (categoryIndex === -1) {
    res.status(404).json({
      error: "Категория не найдена",
    })
    return
  }

  if (name) categories[categoryIndex].name = name
  if (slug) categories[categoryIndex].slug = slug

  res.json({
    category: categories[categoryIndex],
  })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  const { id } = req.params

  const categoryIndex = categories.findIndex((c) => c.id === id)

  if (categoryIndex === -1) {
    res.status(404).json({
      error: "Категория не найдена",
    })
    return
  }

  categories.splice(categoryIndex, 1)

  res.status(204).send()
}




