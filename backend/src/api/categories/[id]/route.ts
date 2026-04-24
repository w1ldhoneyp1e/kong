import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {requirePermission} from '../../_shared/staffAuth'

type CategoryRecord = {
	id: string,
	name?: string | null,
	handle?: string | null,
	parent_category_id?: string | null,
	parent_category?: {id?: string} | null,
}

type CategoryService = {
	retrieveProductCategory: (id: string) => Promise<CategoryRecord | null>,
	updateProductCategories: (
		id: string,
		data: {
			name?: string,
			handle?: string,
		},
	) => Promise<CategoryRecord>,
	deleteProductCategories: (ids: string[]) => Promise<void>,
}

function toDto(record: CategoryRecord) {
	return {
		id: record.id,
		name: record.name ?? '',
		slug: record.handle ?? '',
		parentId: record.parent_category_id
			?? record.parent_category?.id
			?? null,
	}
}

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {id} = req.params
	const categoryService = req.scope.resolve(Modules.PRODUCT) as unknown as CategoryService
	const category = await categoryService.retrieveProductCategory(id).catch(() => null)

	if (!category) {
		res.status(404).json({
			error: 'Категория не найдена',
		})
		return
	}

	res.json({category: toDto(category)})
}

const PUT = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'catalog:manage')
	if (!actor) {
		return
	}

	const {id} = req.params
	const {name, slug} = (req.body as {
		name?: string,
		slug?: string,
	}) || {}
	const categoryService = req.scope.resolve(Modules.PRODUCT) as unknown as CategoryService
	const existing = await categoryService.retrieveProductCategory(id).catch(() => null)

	if (!existing) {
		res.status(404).json({
			error: 'Категория не найдена',
		})
		return
	}

	const updated = await categoryService.updateProductCategories(id, {
		...(name !== undefined && name !== null && {
			name: name.trim(),
		}),
		...(slug !== undefined && slug !== null && {
			handle: slug.trim().toLowerCase(),
		}),
	})
	if (!updated) {
		res.status(500).json({error: 'Сервер не вернул обновлённую категорию'})
		return
	}
	res.json({category: toDto(updated)})
}

const DELETE = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'catalog:manage')
	if (!actor) {
		return
	}

	const {id} = req.params
	const categoryService = req.scope.resolve(Modules.PRODUCT) as unknown as CategoryService
	const existing = await categoryService.retrieveProductCategory(id).catch(() => null)

	if (!existing) {
		res.status(404).json({
			error: 'Категория не найдена',
		})
		return
	}

	await categoryService.deleteProductCategories([id])
	res.status(204).send()
}

export {
	GET,
	PUT,
	DELETE,
}
