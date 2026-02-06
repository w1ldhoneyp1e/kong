import {getApiBase} from '../../shared'

async function parseRes(res: Response): Promise<unknown> {
	const text = await res.text()

	if (!text) {
		return {}
	}

	try {
		return JSON.parse(text) as unknown
	}
	catch {
		throw new Error(res.ok
			? 'Ответ не JSON'
			: `HTTP ${res.status}: ${text.slice(0, 100)}`)
	}
}

type Category = {
	id: string,
	name: string,
	slug: string,
	parentId?: string | null,
}

type CategoryTreeNode = Category & {children: CategoryTreeNode[]}

function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
	const byId = new Map<string, CategoryTreeNode>(
		categories.map(c => [
			c.id,
			{
				...c,
				children: [],
			},
		]),
	)

	const roots: CategoryTreeNode[] = []
	categories.forEach(c => {
		const node = byId.get(c.id)!
		const parentId = c.parentId ?? null
		const parent = parentId
			? byId.get(parentId)
			: null

		if (parent) {
			parent.children.push(node)
		}
		else {
			roots.push(node)
		}
	})

	return roots
}

type FlattenCategoryItem = {
	id: string,
	name: string,
	depth: number,
}

function flattenCategoryTree(
	nodes: CategoryTreeNode[],
	depth = 0,
): FlattenCategoryItem[] {
	const result: FlattenCategoryItem[] = []
	for (const node of nodes) {
		result.push({
			id: node.id,
			name: node.name,
			depth,
		})
		result.push(...flattenCategoryTree(node.children, depth + 1))
	}

	return result
}

const categoriesApi = {
	getAll: async (): Promise<Category[]> => {
		const res = await fetch(`${getApiBase()}/categories`)
		const data = (await parseRes(res)) as {
			categories?: Category[],
			message?: string,
			error?: string,
		}

		if (!res.ok) {
			throw new Error(data?.message || data?.error || `HTTP ${res.status}`)
		}

		return data.categories ?? []
	},

	getById: async (id: string): Promise<Category> => {
		const res = await fetch(`${getApiBase()}/categories/${id}`)
		const data = (await parseRes(res)) as {category?: Category}

		if (!res.ok) {
			throw new Error((data as {error?: string})?.error || `HTTP ${res.status}`)
		}

		return data.category as Category
	},

	create: async (name: string, slug: string, parentId?: string | null): Promise<Category> => {
		const res = await fetch(`${getApiBase()}/categories`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				name,
				slug,
				parentId: parentId ?? null,
			}),
		})
		const raw = await parseRes(res)
		const data = raw as {
			category?: Category,
			error?: string,
			message?: string,
		}

		if (!res.ok) {
			const msg = typeof raw === 'string'
				? raw
				: (data?.error ?? data?.message ?? `HTTP ${res.status}`)
			throw new Error(msg)
		}

		return data.category as Category
	},

	update: async (id: string, name: string, slug: string): Promise<Category> => {
		const res = await fetch(`${getApiBase()}/categories/${id}`, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				name,
				slug,
			}),
		})
		const data = (await parseRes(res)) as {
			category?: Category,
			error?: string,
		}

		if (!res.ok) {
			throw new Error(data?.error || `HTTP ${res.status}`)
		}

		return data.category as Category
	},

	delete: async (id: string): Promise<void> => {
		const res = await fetch(`${getApiBase()}/categories/${id}`, {method: 'DELETE'})

		if (!res.ok) {
			const data = (await parseRes(res)) as {error?: string}
			throw new Error(data?.error || `HTTP ${res.status}`)
		}
	},
}

export type {
	Category, CategoryTreeNode, FlattenCategoryItem,
}
export {
	buildCategoryTree, categoriesApi as api, flattenCategoryTree,
}
