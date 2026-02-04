import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {CATEGORY_MODULE} from '../../modules/category'

type CategoryRecord = {
	id: string,
	name: string,
	slug: string,
	parent_id?: string | null,
}

type CategoryService = {
	listCategories: (filters?: object, config?: {take?: number}) => Promise<CategoryRecord[]>,
	createCategories: (data: {
		name: string,
		slug: string,
		parent_id?: string | null,
	}) => Promise<CategoryRecord[]>,
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
	const categoryService = req.scope.resolve(CATEGORY_MODULE) as CategoryService
	const list = await categoryService.listCategories({}, {take: 1000})
	const categories = list.map(c => toDto(c))
	res.json({categories})
}

const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const {
		name, slug, parentId,
	} = (req.body as {
		name?: string,
		slug?: string,
		parentId?: string | null,
	}) || {}

	if (!name || !slug) {
		res.status(400).json({
			error: 'name и slug обязательны',
		})
		return
	}

	const categoryService = req.scope.resolve(CATEGORY_MODULE) as CategoryService
	const [created] = await categoryService.createCategories({
		name,
		slug,
		parent_id: parentId ?? null,
	})
	res.status(201).json({category: toDto(created)})
}

export {
	GET,
	POST,
}
