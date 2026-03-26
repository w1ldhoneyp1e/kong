import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {CATEGORY_MODULE} from '../../modules/category'
import {requirePermission} from '../_shared/staffAuth'

type CategoryRecord = {
	id: string,
	name: string,
	slug: string,
	parent_id?: string | null | {id?: string},
}

type CategoryService = {
	listCategories: (filters?: object, config?: {take?: number}) => Promise<CategoryRecord[]>,
	createCategories: (data: {
		name: string,
		slug: string,
		parent_id?: string | null,
	}[]) => Promise<CategoryRecord[]>,
}

function parentIdFromRecord(record: CategoryRecord): string | null {
	const p = record.parent_id
	if (p === null || p === undefined) {
		return null
	}
	if (typeof p === 'object' && p !== null && 'id' in p) {
		const id = (p as {id?: string}).id
		return id ?? null
	}
	return typeof p === 'string'
		? p
		: null
}

function toDto(record: CategoryRecord) {
	return {
		id: record.id,
		name: record.name,
		slug: record.slug,
		parentId: parentIdFromRecord(record),
	}
}

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const categoryService = req.scope.resolve(CATEGORY_MODULE) as CategoryService
	const list = await categoryService.listCategories({}, {take: 1000})
	const categories = list.map(c => toDto(c))
	res.json({categories})
}

const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = requirePermission(req, res, 'catalog:manage')
	if (!actor) {
		return
	}

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

	try {
		const categoryService = req.scope.resolve(CATEGORY_MODULE) as CategoryService
		const createdList = await categoryService.createCategories([
			{
				name,
				slug,
				parent_id: parentId ?? null,
			},
		])
		const created = createdList?.[0]
		if (!created?.id) {
			res.status(500).json({error: 'Сервер не вернул id категории'})
			return
		}
		res.status(201).json({id: created.id})
	}
	catch (e) {
		const message = e instanceof Error
			? e.message
			: 'Ошибка создания категории'
		res.status(500).json({error: message})
	}
}

export {
	GET,
	POST,
}
