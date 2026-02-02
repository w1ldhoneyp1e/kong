'use client'

import {useSearchParams} from 'next/navigation'
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import {SearchHits} from '../../components/search/SearchHits'
import {type MedusaProduct, listProducts} from '../../lib/api/products'

function SearchPage() {
	const searchParams = useSearchParams()
	const q = searchParams.get('q') ?? ''
	const [products, setProducts] = useState<MedusaProduct[]>([])
	const [loading, setLoading] = useState(true)

	const load = useCallback(async () => {
		setLoading(true)
		try {
			const {products: list} = await listProducts({
				q: q.trim() || undefined,
				limit: 50,
			})
			setProducts(list)
		}
		catch {
			setProducts([])
		}
		finally {
			setLoading(false)
		}
	}, [q])

	useEffect(() => {
		load()
	}, [load])

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-semibold mb-4">
				{q.trim()
					? `Поиск: ${q}`
					: 'Поиск'}
			</h1>
			{loading
				? (
					<p className="text-gray-600">{'Загрузка...'}</p>
				)
				: (
					<SearchHits products={products} />
				)}
		</div>
	)
}

export {SearchPage as default}
