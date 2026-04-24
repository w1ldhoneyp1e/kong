import {type MedusaRequest, type MedusaResponse} from '@medusajs/framework'
import {Modules} from '@medusajs/framework/utils'
import {requirePermission} from '../_shared/staffAuth'

type CategoryRecord = {
	id: string,
	name?: string | null,
	handle?: string | null,
	parent_category_id?: string | null,
	parent_category?: {id?: string} | null,
	is_active?: boolean,
	is_internal?: boolean,
}

type CategoryService = {
	listProductCategories: (
		filters?: object,
		config?: {take?: number, select?: string[], order?: Record<string, 'ASC' | 'DESC'>},
	) => Promise<CategoryRecord[]>,
	createProductCategories: (data: {
		name: string,
		handle?: string,
		description?: string,
		is_active?: boolean,
		is_internal?: boolean,
		parent_category_id?: string | null,
	}) => Promise<CategoryRecord>,
}

function parentIdFromRecord(record: CategoryRecord): string | null {
	return record.parent_category_id
		?? record.parent_category?.id
		?? null
}

function toDto(record: CategoryRecord) {
	const name = record.name ?? ''
	const slug = record.handle ?? ''

	return {
		id: record.id,
		name,
		slug,
		parentId: parentIdFromRecord(record),
	}
}

function isRenderableCategory(record: ReturnType<typeof toDto>): boolean {
	return record.name.trim().length > 0 && record.slug.trim().length > 0
}

async function getDetailedProductCategories(categoryService: CategoryService): Promise<CategoryRecord[]> {
	return categoryService.listProductCategories({}, {
		take: 1000,
		select: [
			'id',
			'name',
			'handle',
			'parent_category_id',
			'is_active',
			'is_internal',
		],
		order: {
			rank: 'ASC',
			name: 'ASC',
		},
	})
}

const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const categoryService = req.scope.resolve(Modules.PRODUCT) as unknown as CategoryService
	const detailed = await getDetailedProductCategories(categoryService)
	const categories = detailed
		.map(c => toDto(c))
		.filter(isRenderableCategory)
	res.json({categories})
}

const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
	const actor = await requirePermission(req, res, 'catalog:manage')
	if (!actor) {
		return
	}

	const body = (req.body as {
		name?: string,
		slug?: string,
		parentId?: string | null,
	}) || {}
	const name = body.name?.trim() ?? ''
	const slug = body.slug?.trim() ?? ''
	const parentId = body.parentId ?? null

	if (!name || !slug) {
		res.status(400).json({
			error: 'name и slug обязательны',
		})
		return
	}

	try {
		const categoryService = req.scope.resolve(Modules.PRODUCT) as unknown as CategoryService
		const existingList = await getDetailedProductCategories(categoryService)
		const normalizedSlug = slug.toLowerCase()
		const existing = existingList.find(category => {
			const categorySlug = (category.handle ?? '').trim().toLowerCase()

			return categorySlug === normalizedSlug
		})
		if (existing?.id) {
			res.status(409).json({
				error: 'Категория с таким URL уже существует',
			})
			return
		}

		const created = await categoryService.createProductCategories({
			name,
			handle: normalizedSlug,
			description: '',
			is_active: true,
			is_internal: false,
			parent_category_id: parentId ?? null,
		})
		if (!created?.id) {
			res.status(500).json({error: 'Сервер не вернул id категории'})
			return
		}
		res.status(201).json({category: toDto(created)})
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
