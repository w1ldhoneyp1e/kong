import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {CATEGORY_MODULE} from '../../../modules/category'
import {requirePermission} from '../../_shared/staffAuth'

type CategoryRecord = {
	id: string,
	name: string,
	slug: string,
	parent_id?: string | null,
}

type CategoryService = {
	retrieveCategory: (id: string) => Promise<CategoryRecord | null>,
	updateCategories: (data: {
		id: string,
		name?: string,
		slug?: string,
	}[]) => Promise<CategoryRecord[]>,
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

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const categoryService = req.scope.resolve(CATEGORY_MODULE) as CategoryService
	const category = await categoryService.retrieveCategory(id).catch(() => null)

	if (!category) {
		res.status(404).json({
			error: 'Категория не найдена',
		})
		return
	}

	res.json({category: toDto(category)})
}

const PUT = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'catalog:manage')
	if (!actor) {
		return
	}

	const {id} = req.params
	const {name, slug} = (req.body as {
		name?: string,
		slug?: string,
	}) || {}
	const categoryService = req.scope.resolve(CATEGORY_MODULE) as CategoryService
	const existing = await categoryService.retrieveCategory(id).catch(() => null)

	if (!existing) {
		res.status(404).json({
			error: 'Категория не найдена',
		})
		return
	}

	const updatedList = await categoryService.updateCategories([
		{
			id,
			...(name !== undefined && name !== null && {name}),
			...(slug !== undefined && slug !== null && {slug}),
		},
	])
	const updated = Array.isArray(updatedList)
		? updatedList[0]
		: updatedList
	if (!updated) {
		res.status(500).json({error: 'Сервер не вернул обновлённую категорию'})
		return
	}
	res.json({category: toDto(updated)})
}

const DELETE = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'catalog:manage')
	if (!actor) {
		return
	}

	const {id} = req.params
	const categoryService = req.scope.resolve(CATEGORY_MODULE) as CategoryService
	const existing = await categoryService.retrieveCategory(id).catch(() => null)

	if (!existing) {
		res.status(404).json({
			error: 'Категория не найдена',
		})
		return
	}

	await categoryService.deleteCategories([id])
	res.status(204).send()
}

export {
	GET,
	PUT,
	DELETE,
}
