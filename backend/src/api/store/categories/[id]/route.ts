import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

const categories = [
  { id: "1", name: "Электроника", slug: "electronics" },
  { id: "2", name: "Одежда", slug: "clothing" },
  { id: "3", name: "Книги", slug: "books" },
]

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params

  const category = categories.find((c) => c.id === id)

  if (!category) {
    return res.status(404).json({
      error: "Категория не найдена",
    })
  }

  res.json({
    category,
  })
}

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const { name, slug } = req.body

  const categoryIndex = categories.findIndex((c) => c.id === id)

  if (categoryIndex === -1) {
    return res.status(404).json({
      error: "Категория не найдена",
    })
  }

  if (name) categories[categoryIndex].name = name
  if (slug) categories[categoryIndex].slug = slug

  res.json({
    category: categories[categoryIndex],
  })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params

  const categoryIndex = categories.findIndex((c) => c.id === id)

  if (categoryIndex === -1) {
    return res.status(404).json({
      error: "Категория не найдена",
    })
  }

  categories.splice(categoryIndex, 1)

  res.status(204).send()
}

