import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import {getProductByHandle, listProducts} from './api'

describe('product api', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('добавляет category и сортировку в query', async () => {
		const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue({
			ok: true,
			json: async () => ({
				products: [],
				count: 0,
			}),
		} as Response)

		await listProducts({
			categoryId: 'cat_123',
			order: 'title',
			limit: 12,
			offset: 24,
		})

		expect(fetchMock).toHaveBeenCalledTimes(1)
		const calledUrl = String(fetchMock.mock.calls[0]?.[0] ?? '')
		expect(calledUrl).toContain('category_id%5B%5D=cat_123')
		expect(calledUrl).toContain('order=title')
		expect(calledUrl).toContain('limit=12')
		expect(calledUrl).toContain('offset=24')
	})

	it('возвращает null если товар не найден по handle', async () => {
		vi.spyOn(global, 'fetch').mockResolvedValue({
			ok: true,
			json: async () => ({
				products: [],
				count: 0,
			}),
		} as Response)

		const product = await getProductByHandle('missing')

		expect(product).toBeNull()
	})
})
