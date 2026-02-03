import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CATEGORY_MODULE } from "../../../modules/category"

type CategoryRecord = { id: string; name: string; slug: string; parent_id?: string | null }

type CategoryService = {
  retrieveCategory: (id: string) => Promise<CategoryRecord | null>,
  updateCategories: (data: { id: string; name?: string; slug?: string }) => Promise<CategoryRecord[]>,
  deleteCategories: (ids: string[]) => Promise<void>,
}

function toDto(record: CategoryRecord) {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    parentId: record.parent_id ?? null,
  }
}

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  const { id } = req.params
  const categoryService = req.scope.resolve(CATEGORY_MODULE) as CategoryService
  const category = await categoryService.retrieveCategory(id).catch(() => null)

  if (!category) {
    res.status(404).json({
      error: "Категория не найдена",
    })
    return
  }

  res.json({ category: toDto(category) })
}

export const PUT = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  const { id } = req.params
  const { name, slug } = (req.body as { name?: string; slug?: string }) || {}
  const categoryService = req.scope.resolve(CATEGORY_MODULE) as CategoryService
  const existing = await categoryService.retrieveCategory(id).catch(() => null)

  if (!existing) {
    res.status(404).json({
      error: "Категория не найдена",
    })
    return
  }

  const [updated] = await categoryService.updateCategories({
    id,
    ...(name != null && { name }),
    ...(slug != null && { slug }),
  })
  res.json({ category: toDto(updated) })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  const { id } = req.params
  const categoryService = req.scope.resolve(CATEGORY_MODULE) as CategoryService
  const existing = await categoryService.retrieveCategory(id).catch(() => null)

  if (!existing) {
    res.status(404).json({
      error: "Категория не найдена",
    })
    return
  }

  await categoryService.deleteCategories([id])
  res.status(204).send()
}
